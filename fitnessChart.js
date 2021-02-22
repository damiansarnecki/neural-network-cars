var ctxfitnessPerGenerationChart = document.getElementById('fitnessPerGenerationChart').getContext('2d');
            var fitnessPerGenerationChart = new Chart(ctxfitnessPerGenerationChart, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Fitness per generation',
                        data: [],
                        backgroundColor: 'rgb(0,20,235,0.4)'
                    },
                    {
                        label: 'Average fitness per generation',
                        data: [],
                        backgroundColor: 'rgb(0,180,235,0.4)'
                    }],
                    labels: []
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],


                    },
                    responsive: true,
                    maintainAspectRatio: false,

                }
            });