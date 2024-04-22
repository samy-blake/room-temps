function getFormatTitleTime(list) {
  const first = list[0].time;
  const last = list[list.length - 1].time;
  const firstDate = new Date(parseInt(first));
  const lastDate = new Date(parseInt(last));

  return `${firstDate.getDate().toString().padStart(2, "0")}.${firstDate
    .getMonth()
    .toString()
    .padStart(2, "0")}.${firstDate.getFullYear()} - ${lastDate
    .getDate()
    .toString()
    .padStart(2, "0")}.${lastDate
    .getMonth()
    .toString()
    .padStart(2, "0")}.${lastDate.getFullYear()}`;
}

async function DayChart() {
  const dayTempChart = new Chart(document.getElementById("dayTemp"), {
    type: "line",
    data: {},
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Tag`,
        },
      },
    },
  });
  const response = await fetch("/day");
  const apiData = await response.json();

  dayTempChart.options.plugins.title.text = `Tag ${getFormatTitleTime(
    apiData
  )}`;
  dayTempChart.data.labels = apiData.map((v) => {
    const date = new Date(parseInt(v.time));
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });
  dayTempChart.data.datasets = [
    {
      label: "Temperatur",
      data: apiData.map((v) => v.temperature),
      borderWidth: 1,
    },
  ];
  dayTempChart.update();
}

async function MonthChart() {
  const monthTempChart = new Chart(document.getElementById("monthTemp"), {
    type: "line",
    data: {},
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Monat`,
        },
      },
    },
  });
  const response = await fetch("/month");
  const apiData = await response.json();
  const monthData = {};

  for (const row of apiData) {
    const date = new Date(parseInt(row.time));
    const key =
      date.getDate().toString().padStart(2, "0") +
      "." +
      date.getMonth().toString().padStart(2, "0");
    if (!Object.hasOwnProperty.call(monthData, key)) {
      monthData[key] = [];
    }
    monthData[key].push(parseFloat(row.temperature));
  }

  const chartData = {
    labels: [],
    data: [],
  };
  for (const monthKey in monthData) {
    const sum = monthData[monthKey].reduce((a, b) => a + b, 0);
    const avg = sum / monthData[monthKey].length || 0;
    chartData.labels.push(monthKey);
    chartData.data.push(avg);
  }

  monthTempChart.options.plugins.title.text = `Monat  ${getFormatTitleTime(
    apiData
  )}`;
  monthTempChart.data.labels = chartData.labels;
  monthTempChart.data.datasets = [
    {
      label: "Temperatur",
      data: chartData.data,
      borderWidth: 1,
    },
  ];
  monthTempChart.update();
}

async function YearChart() {
  const yearTempChart = new Chart(document.getElementById("yearTemp"), {
    type: "line",
    data: {},
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Jahr`,
        },
      },
    },
  });

  const response = await fetch("/year");
  const apiData = await response.json();
  const yearData = {};

  for (const row of apiData) {
    const date = new Date(parseInt(row.time));
    const key =
      date.getMonth().toString().padStart(2, "0") + "." + date.getFullYear();

    if (!Object.hasOwnProperty.call(yearData, key)) {
      yearData[key] = [];
    }
    yearData[key].push(parseFloat(row.temperature));
  }

  const chartData = {
    labels: [],
    data: [],
  };
  for (const yearKeyData in yearData) {
    const sum = yearData[yearKeyData].reduce((a, b) => a + b, 0);
    const avg = sum / yearData[yearKeyData].length || 0;
    chartData.labels.push(yearKeyData);
    chartData.data.push(avg);
  }

  yearTempChart.options.plugins.title.text = `Jahr ${getFormatTitleTime(
    apiData
  )}`;
  yearTempChart.data.labels = chartData.labels;
  yearTempChart.data.datasets = [
    {
      label: "Temperatur",
      data: chartData.data,
      borderWidth: 1,
    },
  ];
  yearTempChart.update();
}

DayChart();
MonthChart();
YearChart();
