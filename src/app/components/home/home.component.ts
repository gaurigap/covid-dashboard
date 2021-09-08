import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { countryDataSummary } from 'src/app/models/country-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';
import { ageDataSummary } from 'src/app/models/age-data';
import { FormControl, FormGroup } from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalCases: any = '';
  totalDeaths: any = '';
  totalRecovered: any = '';
  data: any;
  result: any;
  chart: any = [];
  chart1: any = [];
  public ageRange: any = [];
  public ageId: any = [];
  public formatedallDates: any = [];
  countryData: countryDataSummary = {
    cases: 0,
    recovered: 0,
    deaths: 0,
  };
  public ageData: any = [100,100,100,100];
  // ageData:ageDataSummary = {
  //   casesMale:0,
  //   casesFemale:0,
  //   deathsMale:0,
  //   deathsFemale:0,
  // };
  ageGroup = [
    { group: 'A00-A04' },
    { group: 'A05-A14' },
    { group: 'A15-A34' },
    { group: 'A35-A59' },
    { group: 'A60-A79' },
    { group: 'A80+' },
  ];

  form = new FormGroup({
    ageGroup1: new FormControl(''),
  });

  public keys: any = {};
  public respData: any = {};

  constructor(private dataService: DataServiceService) {}
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  public lineChartLabel: any = [];
  public lineChartData: any = [];

  ngOnInit(): void {
    this.loadCountryDataSummary();
    this.loadCountryDatilyData();
    //this.loadCountryAgeGroupData();
  }
  get f() {
    return this.form.controls;
  }

  submit() {
    this.ageId = this.form.value;
    //this.loadPieChart(this.ageId);
    this.loadCountryAgeGroupData(this.ageId.ageGroup1);

    console.log(this.ageId.ageGroup1);
  }
  loadLineChart() {
    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.formatedallDates,
        datasets: [
          {
            label: '# of daily Cases',
            data: this.lineChartData,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
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
  loadPieChart(ageData: any) {
    console.log(ageData);
    this.chart1 = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Cases Male', 'Cases Female', 'Deaths Male', 'Deaths Female'],
        datasets: [
          {
            label: 'Age Group Data',
            data: ageData,
            backgroundColor: ['#4282eb', '#b8217b', '#FF0000', '#b86221'],
            borderWidth: 1,
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
    setInterval(function () {
      window.location.reload();
    }, 10000);
  }

  loadCountryDataSummary() {
    this.dataService.getRequest('/germany').subscribe((data: any) => {
      console.log(data);
      this.respData = data;
      this.countryData = {
        cases: data.cases,
        recovered: data.recovered,
        deaths: data.deaths,
      };
    });
    //this.initChart('c');
  }
  loadCountryDatilyData() {
    this.dataService
      .getRequest('/germany/history/cases')
      .subscribe((data: any) => {
        //console.log(data.data[0].date);
        for (let i = 0; i < data.data.length; i++) {
          //console.log("hi");
          this.lineChartData.push(data.data[i].cases);
          //console.log(data.data[i].cases);
          //console.log(this.lineChartData[i]);
        }
        for (let i = 0; i < data.data.length; i++) {
          this.lineChartLabel.push(data.data[i].date);
          let newDate = new Date(this.lineChartLabel[i]);
          let formatedDate = this.getFormatedDate(newDate, 'MM/dd/yyyy');
          this.formatedallDates.push(formatedDate);
        }
        this.loadLineChart();
      });
  }
  loadCountryAgeGroupData(ageId: any) {
    let id = ageId.toString();
    console.log(typeof id);
    this.dataService
      .getRequest('/germany/age-groups')
      .subscribe((response: any) => {
        this.keys = response.data;
        console.log(response.data[id]);
        this.ageRange.push(response.data[id]);
        this.ageData.push(response.data[id].casesMale);
        this.ageData.push(response.data[id].casesFemale);
        this.ageData.push(response.data[id].deathsMale);
        this.ageData.push(response.data[id].deathsFemale);
        console.log(this.ageData);
        // for (let i = 0; i < len; i++) {
        // this.ageGroupData.push(response.data[abbreviation].history[i].cases);

        //   //console.log(data.data[i].cases);
        // }
        location.reload();
        window.stop();
        this.loadPieChart(this.ageData);
      });
  }
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
}
