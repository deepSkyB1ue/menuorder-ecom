<template>
  <div class="main">
        <div class="search-fake-input"
             @click="onFakeInputClick">
          <label>输入城市名或拼音查询</label>
        </div>
      <div class="orientation-container">
          <img class="orientation-img" src="../assets/img/orientation.png"/>
          <span class="orientation-info" v-if="orientationSucceed" @click="onOrientationCityClick">{{ orientationCity }}</span>
          <span class="orientation-info" v-if="orientationCompleted && !orientationSucceed" @click="onOrientationStart">定位失败，请点击重试</span>
          <span class="orientation-info" v-if="!orientationCompleted">定位中……</span>
          <!--<span class="orientation-info">上海市</span>-->
          <span class="subtitle">GPS定位</span>
      </div>
    <div class="hot-city-container"
         ref="hotCityContainer"
         v-if="cityList.popularCitys.length">
      <h2>热门城市</h2>
      <div class="grid-cell"
           v-for="city in cityList.popularCitys"
           :key="city.cityId"
           @click="onCityClick(city, 'hot')">
        <label class="grid-cell-title">{{ city.cityName }}</label>
      </div>
    </div>
    <div class="city-list-container"
         ref="cityListContainer"
         v-if="cityList.allCitys.length">
      <div class="city-section"
           v-for="group in pinyinGroupedCityList"
           :key="group.firstLetter">
        <h2>{{ group.firstLetter }}</h2>
        <ul class="list">
          <li class="list-row"
              v-for="city in group.cities"
              :key="city.cityId"
              @click="onCityClick(city)">
            <label class="list-row-title">{{ city.cityName }}</label>
          </li>
        </ul>
      </div>
    </div>
    <div class="search-page-container"
         v-show="showSearchResult">
      <div class="search-input-area">
        <input id="search-input"
               ref="searchInput"
               type="text"
               placeholder="输入城市名或拼音查询"
               v-model="searchText">
        <button id="search-cancel-btn"
                @click="onSearchCancelClick">取消</button>
      </div>
      <div class="search-result-list">
        <ul class="list">
          <li class="list-row"
              v-for="city in citySearchResultList"
              :key="city.cityId"
              @click="onCityClick(city)">
            <label class="list-row-title">{{ city.cityName }}</label>
          </li>
        </ul>
      </div>
    </div>
    <ui-toast :visible="toast.visible"
              :text="toast.text"></ui-toast>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */

import Vue from 'vue';
import UIToast from '../components/ui-base/toast/toast';
import { Ajax, getUrlParam, getLocation } from '../lib/utils.js';

const jsonp = require('jsonp');

Vue.component('ui-toast', UIToast);

// Throttle function
// See https://medium.com/@_jh3y/throttling-and-debouncing-in-javascript-b01cad5c8edf
const throttle = function (func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function (...theArgs) {
        const context = this;
        const args = theArgs;
        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

export default {
    name: 'OrderApplyMCity',
    data() {
        return {
            orientationCompleted: false,
            orientationSucceed: false,
            orientationCity: '',
            showSearchResult: false,
            searchText: '',
            citySearchResultList: [],
            toast: {
                visible: false,
                text: '',
            },
            cityList: {
                popularCitys: [],
                allCitys: [],
            },
            activityCode: getUrlParam('activity_code'),
        };
    },
    computed: {
        pinyinGroupedCityList() {
            const pinyinGroupedCityMap = this.cityList.allCitys.reduce((rv, x) => {
                const firstLetter = x.cityPinYin[0];
                (rv[firstLetter] = rv[firstLetter] || []).push(x);
                return rv;
            }, {});

            const result = [];
            for (const key in pinyinGroupedCityMap) {
                if (pinyinGroupedCityMap.hasOwnProperty(key)) {
                    const element = pinyinGroupedCityMap[key];
                    element.sort((a, b) => {
                        if (a.cityPinYin < b.cityPinYin) {
                            return -1;
                        } else if (a.cityPinYin > b.cityPinYin) {
                            return 1;
                        }
                        return 0;
                    });
                    result.push({
                        firstLetter: key,
                        cities: element,
                    });
                }
            }

            result.sort((a, b) => {
                if (a.firstLetter < b.firstLetter) {
                    return -1;
                } else if (a.firstLetter > b.firstLetter) {
                    return 1;
                }
                return 0;
            });
            return result;
        },
    },
    watch: {
        searchText: 'calculateCitiesSearchResult',
    },
    mounted() {
        this.getCityList();
        this.restoreInputContentFromTemp();
        if (!this.orientationCity) {
            this.onOrientationStart();
        }
    },
    methods: {
        restoreInputContentFromTemp() {
            const orientationCity = JSON.parse(
                sessionStorage.getItem('orientationCity'),
            );
            this.orientationCity = orientationCity;
            if (orientationCity) {
                this.orientationCompleted = true;
                this.orientationSucceed = true;
            }
        },
        onOrientationStart() {
            const self = this;
            const data = {};
            getLocation({
                success(e) {
                    data.lat = e.lat || 0; // 纬度
                    data.lng = e.lng || 0; // 经度
                    self.obtainCityName(data);
                },
                fail() {
                    data.lat = 0; // 纬度
                    data.lng = 0; // 经度
                    self.obtainCityName(data);
                },
            });
        },
        obtainCityName(data) {
            const self = this;
            const key = 'EDbaac610a111b8cdf7886a1118d87c6';
            const apiUrl = `https://api.map.baidu.com/geocoder/v2/?ak=${key}&location=${data.lat},${data.lng}&output=json&pois=1`;
            jsonp(apiUrl, null, (err, resData) => {
                self.orientationCity = resData.result.addressComponent.city;
                self.orientationSucceed = true;
                self.orientationCompleted = true;
            });
        },
        onOrientationCityClick() {
            sessionStorage.setItem('orientationSucceed', JSON.stringify(this.orientationSucceed));
            sessionStorage.setItem('orientationCity', JSON.stringify(this.orientationCity));
            if (this.$router) {
                this.$router.replace('/orderapply/m/miaofu');
            } else {
                window.location.replace('orderapplymmiaofu.html');
            }
        },
        onFakeInputClick() {
            this.showSearchResult = true;
            this.$refs.hotCityContainer.style.display = 'none';
            this.$refs.cityListContainer.style.display = 'none';
            const self = this;
            Vue.nextTick(() => {
                self.$refs.searchInput.focus();
            });
        },
        onSearchCancelClick() {
            this.showSearchResult = false;
            this.searchText = '';
            this.$refs.hotCityContainer.style.display = 'block';
            this.$refs.cityListContainer.style.display = 'block';
        },
        onCityClick(selectedCity, type) {
            sessionStorage.setItem('selectedCityName', type === 'hot' ? `${selectedCity.cityName}市` : selectedCity.cityName);
            if (this.$router) {
                this.$router.replace('/orderapply/m/miaofu');
            } else {
                window.location.replace('orderapplymmiaofu.html');
            }
        },
        calculateCitiesSearchResult: throttle(function () {
            const textToSearch = this.searchText;
            const result = [];
            this.cityList.allCitys.forEach((city) => {
                if (city.cityPinYin.indexOf(textToSearch) >= 0
        || city.cityName.indexOf(textToSearch) >= 0) {
                    result.push(city);
                }
            });
            this.citySearchResultList = result;
        }, 500),

        getCityList() {
            Ajax.get({
                url: 'cooperate/getCityList',
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.cityList = res.data;
                    } else {
                        this.showToast(res.msg);
                    }
                },
                error: () => {
                    this.showToast('网络错误，请稍后再试');
                },
            });
        },
        showToast(text) {
            if (text.length === 0) {
                return;
            }
            this.toast = {
                visible: true,
                text,
            };
            const self = this;
            setTimeout(() => {
                self.toast.visible = false;
            }, 2000);
        },
    },
};
</script>

<style lang="less">
@bg-grey: #f6f6f6;
@text-black: #333;
@text-grey: #999;
@line-grey: #e5e5e5;

* {
  margin: 0;
  padding: 0;
  outline: 0;
}

li {
  list-style: none;
}

.main {
  color: #333;
  height: 100%;
  font-size: 14px;
  overflow-y: auto
}

.search-fake-input {
  background-color: @bg-grey;
  padding: 10px 30px;
}

.search-fake-input label {
  display: block;
  padding: 7px 0px;
  background-color: white;
  text-align: center;
  color: #999;
  border-radius: 9999px;
}

.search-page-container {
  background-color: @bg-grey;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;

  .search-input-area {
    background-color: white;
    padding: 10px 20px 10px 30px;
    display: flex;

    #search-input {
      flex: 1;
      color: @text-black;
      background-color: @bg-grey;
      padding: 7px 15px;
      border: none;
      border-radius: 9999px;
    }

    #search-cancel-btn {
      border: none;
      background-color: white;
      margin-left: 20px;
      color: #f63;
    }
  }
}

.orientation-container {
    background-color: #fff;
    border-top: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
    position: relative;
    height: 50px;
    line-height: 50px;

    .orientation-img{
        margin-left: 15px;
        display: inline-block;
        width: 11px;
        height: 16px;
        top: 3px;
        position: relative;
        font-size: 0;
        img{
            width: 100%;
            height: 100%;
        }
    }

    .orientation-info {
        position: relative;
        color: #000;
        display: inline-block;
        /*padding: 15px 20px 10px 15px;*/
        height: 50px;
        box-sizing: border-box;
        vertical-align: middle;
        font-size: 15px;
    }

    .subtitle {
        font-size: 12px;
        color: #999999;
    }
}

.hot-city-container {
  padding: 9px 15px 2px 15px;
  background-color: @bg-grey;

  h2 {
    display: block;
    margin-left: 5px;
    margin-bottom: 11px;
    color: @text-grey;
    font-weight: normal;
  }

  .grid-cell {
    display: inline-block;
    margin: 5px;
    width: 98px;
    height: 35px;
    text-align: center;
    background: white;
    border: 1px solid @line-grey;
    border-radius: 2px;

    .grid-cell-title {
      line-height: 35px;
    }
  }
}

.city-list-container {
  h2 {
    padding: 5px 20px;
    background-color: @bg-grey;
    color: @text-grey;
    font-weight: normal;
    text-transform: uppercase;
  }
}

.list {
  background-color: white;

  .list-row {
    margin-left: 20px;
    border-bottom: 1px solid @line-grey;

    .list-row-title {
      padding: 10px 0px;
      line-height: 44px;
    }
  }

  & .list-row:last-child {
    border-bottom-color: #fff
  }
}

*::-webkit-input-placeholder {
  color: @text-grey;
}

*::-moz-placeholder {
  color: @text-grey;
}

*::-ms-input-placeholder {
  color: @text-grey;
}

*:-ms-input-placeholder {
  color: @text-grey;
}
</style>
