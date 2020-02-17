import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatExpansionModule } from '@angular/material/expansion';

interface Weather {
  timezone: String,
  currently: {
    temperature: Number,
    summary: String,
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // private http: HttpClient;

  constructor(private http: HttpClient) { }

  // dataSource = new MatTableDataSource<Weather>();

  columnsToDisplay: string[] = ["Timezone", "Latitude", "Longitude", "Summary"];

  weather = null;


  panelOpenState = false;

  // columnsToDisplay = ["Timezone", "Temperature"];

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather() {
    this.http.get("/api/allweather").subscribe((weather: Weather[]) => {
      console.log(weather);
      this.weather = weather;
      // return this.dataSource.data = weather;
    });
  }

}


