import {Component, ViewEncapsulation} from '@angular/core';
import {Widget} from '../core/widget/widget';
import {ProgressAnimate} from '../core/utils/progress-animate';
import {AnimateNumber} from '../core/utils/animate-number';
import {CheckAll} from '../core/utils/check-all';
import {GeoLocationsWidget} from './geo-locations-widget/geo-locations-widget';
import {MarkerStatsWidget} from './marker-stats-widget/marker-stats-widget';
import {BootstrapCalendar} from './bootstrap-calendar/bootstrap-calendar';
import {ConfigService} from '../core/config';
import {Nvd3Chart} from '../components/nvd3/nvd3';
import {MorrisChart} from '../components/morris/morris';

const d3 = require('d3/d3.js');
const nv = require('nvd3/build/nv.d3.js');

@Component({
  selector: 'dashboard',
  template: require('./dashboard.html'),
  directives: [Widget, ProgressAnimate, AnimateNumber, CheckAll, GeoLocationsWidget, MarkerStatsWidget, BootstrapCalendar, Nvd3Chart, MorrisChart],
  styles: [require('./dashboard.scss'), require('../charts/charts.scss')],
  encapsulation: ViewEncapsulation.None
})

export class Dashboard {
  config: any;
  month: any;
  year: any;

  morris1Options: any;
  morris2Options: any;
  morris3Options: any;
  nvd31Chart: any;
  nvd32Chart: any;
  nvd31Data: any;
  nvd32Data: any;

  constructor(config: ConfigService) {
    this.config = config.getConfig();
  }

  applyNvd3Data(): void {
    /* Inspired by Lee Byron's test data generator. */
    function _stream_layers(n, m, o): Array<any> {
      if (arguments.length < 3) { o = 0; }
      function bump(a): void {
        let x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
        for (let i = 0; i < m; i++) {
          let w = (i / m - y) * z;
          a[i] += x * Math.exp(-w * w);
        }
      }
      return d3.range(n).map(function(): Array<Object> {
        let a = [], i;
        for (i = 0; i < m; i++) { a[i] = o + o * Math.random(); }
        for (i = 0; i < 5; i++) { bump(a); }
        return a.map(function(d, i): Object {
          return {x: i, y: Math.max(0, d)};
        });
      });
    }

    function testData(stream_names, pointCount): Array<any> {
      let now = new Date().getTime(),
        day = 1000 * 60 * 60 * 24, // milliseconds
        daysAgoCount = 60,
        daysAgo = daysAgoCount * day,
        daysAgoDate = now - daysAgo,
        pointsCount = pointCount || 45, // less for better performance
        daysPerPoint = daysAgoCount / pointsCount;
      return _stream_layers(stream_names.length, pointsCount, .1).map(function(data, i): Object {
        return {
          key: stream_names[i],
          values: data.map(function(d, j): Object {
            return {
              x: daysAgoDate + d.x * day * daysPerPoint,
              y: Math.floor(d.y * 100) // just a coefficient,
            };
          })
        };
      });
    }

    this.nvd31Chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .margin({left: 28, bottom: 30, right: 0})
      .color(['#82DFD6', '#ddd']);

    this.nvd31Chart.xAxis
      .showMaxMin(false)
      .tickFormat(function(d): Object { return d3.time.format('%b %d')(new Date(d)); });

    this.nvd31Chart.yAxis
      .showMaxMin(false)
      .tickFormat(d3.format(',f'));

    this.nvd31Data = testData(['Search', 'Referral'], 50).map(function(el, i): boolean {
      el.area = true;
      return el;
    });

    this.nvd32Chart = nv.models.multiBarChart()
      .margin({left: 28, bottom: 30, right: 0})
      .color(['#F7653F', '#ddd']);

    this.nvd32Chart.xAxis
      .showMaxMin(false)
      .tickFormat(function(d): Object { return d3.time.format('%b %d')(new Date(d)); });

    this.nvd32Chart.yAxis
      .showMaxMin(false)
      .tickFormat(d3.format(',f'));

    this.nvd32Data = testData(['Uploads', 'Downloads'], 10).map(function(el, i): boolean {
      el.area = true;
      return el;
    });
  };


  ngOnInit(): void {
    let now = new Date();
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();

    this.applyNvd3Data();

    this.morris1Options = {
      resize: true,
      data: [
        { y: '2006', a: 100, b: 90 },
        { y: '2007', a: 75,  b: 65 },
        { y: '2008', a: 50,  b: 40 },
        { y: '2009', a: 75,  b: 65 },
        { y: '2010', a: 50,  b: 40 },
        { y: '2011', a: 75,  b: 65 },
        { y: '2012', a: 100, b: 90 }
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Series A', 'Series B'],
      lineColors: ['#88C4EE', '#ccc']
    };

    this.morris2Options = {
      resize: true,
      data: [
        { y: '2006', a: 100, b: 90 },
        { y: '2007', a: 75,  b: 65 },
        { y: '2008', a: 50,  b: 40 },
        { y: '2009', a: 75,  b: 65 },
        { y: '2010', a: 50,  b: 40 },
        { y: '2011', a: 75,  b: 65 },
        { y: '2012', a: 100, b: 90 }
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Series A', 'Series B'],
      lineColors: ['#80DE78', '#9EEE9B'],
      lineWidth: 0
    };

    this.morris3Options = {
      data: [
        {label: 'Download Sales', value: 12},
        {label: 'In-Store Sales', value: 30},
        {label: 'Mail-Order Sales', value: 20}
      ],
      colors: ['#F7653F', '#F8C0A2', '#e6e6e6']
    };
  }
}
