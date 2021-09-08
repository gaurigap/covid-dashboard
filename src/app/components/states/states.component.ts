import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { stateDataSummary } from 'src/app/models/state-data';
import { DataServiceService } from 'src/app/services/data-service.service';

import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
Chart.register(...registerables);
export interface statedetail_data {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css'],
})
export class StatesComponent implements OnInit {
  dailyCaseData: any = [];
  dailyDeathData: any = [];
  dailyRecoverData: any = [];
  allDates: any = [];
  chart: any = [];

  //dataSource = new MatTableDataSource<countryDataSummary>(this.countryData);
  stateData: stateDataSummary = {
    name: ' ',
    population: 0,
    cases: 0,
    deaths: 0,
    recovered: 0,
  };
  loading = true;

  public keys: any = {};
  public respData: any = {};
  public isDialogVisible = false;
  public states: any = [];
  // range = new FormGroup({
  // start: new FormControl(),
  // end: new FormControl()
  // });
  start: any;
  end: any;

  public formatedallDates: any = [];
  constructor(
    public dialog: MatDialog,
    private dataService: DataServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStateDataSummary();
  }
  loadLineChart() {
    this.chart = new Chart('linestateChart', {
      type: 'line',
      data: {
        labels: this.formatedallDates,
        datasets: [
          {
            label: '# of daily Cases',
            data: this.dailyCaseData,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
          },
          {
            label: '# of daily Deaths',
            data: this.dailyDeathData,
            borderColor: 'rgb(255, 0, 0)',
          },
          {
            label: '# of daily Recovered',
            data: this.dailyRecoverData,
            borderColor: 'rgb(0,255,0)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  openstatewiseDialog(abbreviation: any) {
    this.isDialogVisible = true;

    this.dataService
      .getRequest('/states/' + abbreviation)
      .subscribe((data: any) => {
        console.log(data.data[abbreviation].name);
        this.stateData = {
          name: data.data[abbreviation].name,
          population: data.data[abbreviation].population,
          cases: data.data[abbreviation].cases,
          deaths: data.data[abbreviation].deaths,
          recovered: data.data[abbreviation].recovered,
        };
      });
    this.loadStateDatilyCaseData(abbreviation);
    this.loadStateDatilyDeathData(abbreviation);
    this.loadStateDatilyRecoveredData(abbreviation);
  }

  loadStateDataSummary() {
    this.dataService.getRequest('/states').subscribe((response: any) => {
      //alert(data);
      //console.log(data);
      this.keys = response.data;

      for (let key in this.keys) {
        this.states.push(response.data[key]);
      }
    });
  }
  loadStateDatilyCaseData(abbreviation: any) {
    this.dataService
      .getRequest('/states/history/cases')
      .subscribe((response: any) => {
        console.log(response.data[abbreviation].history[0].date);
        let len = response.data[abbreviation].history.length;
        for (let i = 0; i < len; i++) {
          // this.StateDetail_Data['cases'] =
          //   response.data[abbreviation].history[i].cases;

          this.dailyCaseData.push(response.data[abbreviation].history[i].cases);

          //console.log(data.data[i].cases);
        }
        for (let i = 0; i < len; i++) {
          this.allDates.push(response.data[abbreviation].history[i].date);
          let newDate = new Date(this.allDates[i]);
          let formatedDate = this.getFormatedDate(newDate, 'MM/dd/yyyy');
          this.formatedallDates.push(formatedDate);
        }
        // let startDate=this.getFormatedDate(this.range.value.start,'MM/dd/yyyy');
        // let endDate=this.getFormatedDate(this.range.value.end,'MM/dd/yyyy');
        //let newArr = this.allDates.slice(startDate, endDate);
        // console.log(picker.startDate);
        // console.log(this.end);
      });
  }
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  loadStateDatilyDeathData(abbreviation: any) {
    this.dataService
      .getRequest('/states/history/deaths')
      .subscribe((response: any) => {
        let len = response.data[abbreviation].history.length;
        //console.log(data.data[0].date);
        for (let i = 0; i < len; i++) {
          //this.StateDetail_Data.deaths[i]=response.data[abbreviation].history[i].deaths;
          this.dailyDeathData.push(
            response.data[abbreviation].history[i].deaths
          );

          //console.log(this.dailyDeathData[i]);
        }
      });
  }
  loadStateDatilyRecoveredData(abbreviation: any) {
    this.dataService
      .getRequest('/states/history/recovered')
      .subscribe((response: any) => {
        let len = response.data[abbreviation].history.length;
        //console.log(data.data[0].date);
        for (let i = 0; i < len; i++) {
          // this.StateDetail_Data.recovered =
          //   response.data[abbreviation].history[i].recovered;
          this.dailyRecoverData.push(
            response.data[abbreviation].history[i].recovered
          );
        }
        this.loadLineChart();
      });
  }
}
