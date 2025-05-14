const API_URL = "https://gist.githubusercontent.com/ai-cristea/95bf91857a4cbe138595ea6876c441f2/raw/date-jira.json";

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const developerData = {};


        data.sprints.forEach(sprint => {
            sprint.tasks.forEach(task => {
                const dev = task.assigned_to;
                if (!developerData[dev]) {
                    developerData[dev] = {
                        assigned: 0,
                        completed: 0,
                        estimated: 0,
                        actual: 0
                    };
                }
                developerData[dev].assigned += 1;
                developerData[dev].estimated += task.estimated_hours;
                developerData[dev].actual += task.actual_hours;
                if (task.status === 'Done') {
                    developerData[dev].completed += 1;
                }
            });
        });

        const devs = Object.keys(developerData);
        const assignedData = devs.map(dev => developerData[dev].assigned);
        const completedData = devs.map(dev => developerData[dev].completed);
        const estimatedData = devs.map(dev => developerData[dev].estimated);
        const actualData = devs.map(dev => developerData[dev].actual);
        const efficiencyData = devs.map(dev =>
            developerData[dev].estimated > 0
                ? +(developerData[dev].estimated / developerData[dev].actual).toFixed(2)
                : 0
        );

        //Chart1: Capacity
        Highcharts.chart('capacity-chart', {
            chart: { type: 'column' },
            title: { text: 'Developer Task Capacity' },
            xAxis: { categories: devs },
            yAxis: { min: 0, title: { text: 'Numar taskuri' } },
            series: [{
                name: 'Atribuite',
                data: assignedData
            }, {
                name: 'Finalizate',
                data: completedData
            }]
        });

        //Chart2: Precizia estimarilor (estimat vs real)
        Highcharts.chart('accuracy-chart', {
            chart: { type: 'column' },
            title: { text: 'Precizia Estimarilor (Estimated vs Actual Hours)' },
            xAxis: { categories: devs },
            yAxis: { min: 0, title: { text: 'Hours' } },
            series: [
                { name: 'Estimated Hours', data: estimatedData },
                { name: 'Actual Hours', data: actualData }
            ]
        });
        //Chart3: Eficienta echipei
        Highcharts.chart('efficiency-chart', {
            chart: { type: 'line' },
            title: { text: 'Eficienta (Estimated / Actual)' },
            xAxis: { catergories: devs },
            yAxis: { title: { text: 'Efficiency Ratio' }, min: 0 },
            series: [{
                name: 'Eficienta',
                data: efficiencyData
            }]
        });
    })
    .catch(error => {
        console.error("Eroare la preluarea datelor:", error);
    });