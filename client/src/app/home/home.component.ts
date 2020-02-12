import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatTableModule } from "@angular/material/table";

interface Weather {
  Timezone: String,
  Temperature: Number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // private http: HttpClient;

  constructor(private http: HttpClient) { }

  columnsToDisplay = ["Timezone", "Temperature"];

  weather = null;

  ngOnInit(): void {

    this.http.get("/api/allweather").subscribe((weather: Weather) => this.weather = weather);

  }

}


