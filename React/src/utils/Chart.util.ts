import Highcharts from 'highcharts';

const get3DDonutOptions = (data: any[], title: string, subTitle: string): Highcharts.Options => {
    Highcharts.setOptions({
        colors: ["#FFEA5D", "#97EE5B", "#5B8CFB", "#ED6559", "#B067FD", "#F5AE5E", "#5E5BF2", "#CC51A8"]
    })
    const chartData: any = {
        credits: {
            enabled: false,
        },
        chart: {
            type: 'pie',
            style: {
                fontFamily: '"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
            },
            options3d: {
                enabled: true,
                alpha: 20
            },
            backgroundColor: '#3b38d1'
        },
        title: {
            text: title || '',
            widthAdjust: -560,
            align: "center",
            verticalAlign: "middle",
            y: 55
        },
        subtitle: {
            text: subTitle || "Summary of Monthly Budgeted Expenses",
            style: {
                color: "#fff",
                fontSize: "1.7rem",
                fontWeight: "bolder"
            }
        },
        plotOptions: {
            pie: {
                innerSize: 250,
                depth: 114,
                size: 340,
                startAngle: -65,
                dataLabels: {
                    style: {
                        fontSize: "16px"
                    }
                }
            },
            series: {
                dataLabels: {
                    enabled: !0,
                    color: "red"
                }
            }
        },
        series: [{
            name: 'Percentage',
            data: []
        }],
    }
    data.forEach((row: any) => {
        chartData.series[0].data.push([
            `<span style='stroke-width:0;fill:#fff;font-size: 0.8rem; text-align: center'>${row[0]}-<span style='fill: orange;'>${row[3]}</span>: <span style='fill: #6AD7BB;'>${row[1]}</span> </span>`,
            row[2]
        ])
    });
    return chartData;
}

export const ChartUtil = {
    get3DDonutOptions,
}
