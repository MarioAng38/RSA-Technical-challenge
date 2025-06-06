import { validateTasks } from "./validate.js";

const spinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

spinner.classList.remove("hidden");

const API_URL =
  "https://gist.githubusercontent.com/ai-cristea/95bf91857a4cbe138595ea6876c441f2/raw/date-jira.json";

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    if (!data || !Array.isArray(data.sprints)) {
      throw new Error("Formatul datelor este invalid sau lipsesc sprints.");
    }

    const validatedSprints = validateTasks(data.sprints);
    const developerData = {};
    let totalTasks = 0;
    let totalEfficiency = 0;

    validatedSprints.forEach((sprint) => {
      sprint.tasks.forEach((task) => {
        const dev = task.assigned_to;
        totalTasks++;
        if (!developerData[dev]) {
          developerData[dev] = {
            assigned: 0,
            completed: 0,
            estimated: 0,
            actual: 0,
          };
        }
        developerData[dev].assigned += 1;
        developerData[dev].estimated += task.estimated_hours;
        developerData[dev].actual += task.actual_hours;
        if (task.status === "Done") {
          developerData[dev].completed += 1;
        }
      });
    });

    const devs = Object.keys(developerData);
    const assignedData = devs.map((dev) => developerData[dev].assigned);
    const completedData = devs.map((dev) => developerData[dev].completed);
    const estimatedData = devs.map((dev) => developerData[dev].estimated);
    const actualData = devs.map((dev) => developerData[dev].actual);
    const efficiencyData = devs.map((dev) =>
      developerData[dev].estimated > 0
        ? +(developerData[dev].estimated / developerData[dev].actual).toFixed(2)
        : 0
    );

    devs.forEach((dev) => {
      if (developerData[dev].estimated > 0 && developerData[dev].actual > 0) {
        const eff = developerData[dev].estimated / developerData[dev].actual;
        totalEfficiency += eff;
      }
    });

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("avgEfficiency").textContent = (
      totalEfficiency / devs.length
    ).toFixed(2);

    //Chart1: Capacity
    const taskDistribution = devs.map((dev) => ({
      name: dev,
      y: developerData[dev].assigned,
    }));

    Highcharts.chart("capacity-chart", {
      chart: { type: "pie" },
      title: { text: "Distributia Taskurilor pe Developer" },
      tooltip: {
        pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y} taskuri)",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y} taskuri",
          },
        },
      },
      series: [
        {
          name: "Taskuri",
          colorByPoint: true,
          data: taskDistribution,
        },
      ],
    });

    //Chart2: Precizia estimarilor (estimat vs real)
    Highcharts.chart("accuracy-chart", {
      chart: { type: "column" },
      title: { text: "Precizia Estimarilor (Estimated vs Actual Hours)" },
      xAxis: { categories: devs },
      yAxis: { min: 0, title: { text: "Hours" } },
      series: [
        { name: "Estimated Hours", data: estimatedData },
        { name: "Actual Hours", data: actualData },
      ],
    });
    //Chart3: Eficienta echipei
    Highcharts.chart("efficiency-chart", {
      chart: { type: "line" },
      title: { text: "Eficienta (Estimated / Actual)" },
      xAxis: { categories: devs },
      yAxis: { title: { text: "Efficiency Ratio" }, min: 0 },
      series: [
        {
          name: "Eficienta",
          data: efficiencyData,
        },
      ],
    });
  })
  .catch((error) => {
    console.error("Eroare la preluarea datelor:", error);
    errorMessage.classList.remove("hidden");
  })
  .finally(() => {
    spinner.classList.add("hidden");
  });
