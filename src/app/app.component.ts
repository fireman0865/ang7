import { Component, ViewChild } from "@angular/core";
import { FlexmonsterPivot } from "ng-flexmonster";
import { Flexmonster } from "ng-flexmonster";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @ViewChild("pivot") pivot: FlexmonsterPivot;
  public pivotReport = {
    dataSource: {
      filename: "https://cdn.flexmonster.com/data/data.csv"
    },
    slice: {
      rows: [
        { uniqueName: "Destination" },
        { uniqueName: "Color" },
        { uniqueName: "[Measures]" }
      ],
      columns: [{ uniqueName: "Category" }, { uniqueName: "Country" }],
      measures: [
        { uniqueName: "Price", aggregation: "sum" },
        { uniqueName: "Quantity", aggregation: "sum" }
      ]
    }
  };

  ngOnInit() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => this.onGoogleChartsLoaded());
  }
  onGoogleChartsLoaded() {
    this.googleChartsLoaded = true;
    if (this.pivotTableReportComplete) {
      this.createGoogleChart();
    }
  }

  onPivotReady(pivot: Flexmonster.Pivot): void {
    console.log("[ready] FlexmonsterPivot", this.pivot);
  }

  onCustomizeCell(
    cell: Flexmonster.CellBuilder,
    data: Flexmonster.CellData
  ): void {
    //console.log("[customizeCell] FlexmonsterPivot");
    if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
    if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
    if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
  }

  pivotTableReportComplete: boolean = false;
  googleChartsLoaded: boolean = false;

  onReportComplete(): void {
    this.pivot.flexmonster.off("reportcomplete");
    this.pivotTableReportComplete = true;
    this.createGoogleChart();
  }

  createGoogleChart() {
    if (this.googleChartsLoaded) {
      this.pivot.flexmonster.googlecharts.getData(
        { type: "column" },
        data => this.drawChart(data),
        data => this.drawChart(data)
      );
    }
  }

  drawChart(_data: any) {
    console.log("<<<<", this.pivot);
    var data = google.visualization.arrayToDataTable(_data.data);

    var options = {
      title: "Sales by Countries",
      legend: { position: "top" },
      colors: ["#1b9e77", "#d95f02", "#7570b3"],
      isStacked: true
    };

    var chart = new google.visualization.ColumnChart(
      document.getElementById("googlechart-container-1")
    );
    chart.draw(data, <google.visualization.ColumnChartOptions>options);
  }
}
