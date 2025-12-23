// 增强版主要JavaScript逻辑
class AcademicMonitoringSystem {
    constructor() {
        this.currentTime = new Date();
        this.particleSystem = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupBackground();
        this.setupTimeDisplay();
        this.setupAnimations();
        this.generateSubjectCards();
        this.createAllCharts();
        this.setupInteractions();
    }

    // 设置动态背景
    setupBackground() {
        const sketch = (p) => {
            let particles = [];
            let gridLines = [];
            let time = 0;

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('background-canvas');
                
                // 创建更多粒子
                for (let i = 0; i < 150; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(1, 4),
                        opacity: p.random(0.2, 0.8),
                        hue: p.random(180, 240)
                    });
                }

                // 创建网格线
                for (let i = 0; i < 30; i++) {
                    gridLines.push({
                        x1: p.random(p.width),
                        y1: p.random(p.height),
                        x2: p.random(p.width),
                        y2: p.random(p.height),
                        opacity: p.random(0.05, 0.15),
                        speed: p.random(0.001, 0.003)
                    });
                }
            };

            p.draw = () => {
                p.clear();
                time += 0.01;
                
                // 绘制动态网格线
                p.stroke(0, 212, 255, 30);
                p.strokeWeight(1);
                gridLines.forEach((line, index) => {
                    const offset = Math.sin(time + index * 0.1) * 20;
                    p.line(line.x1 + offset, line.y1, line.x2 - offset, line.y2);
                });

                // 绘制和更新粒子
                particles.forEach(particle => {
                    p.fill(particle.hue, 100, 100, particle.opacity * 255);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);
                    
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                });

                // 绘制连接线
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 120) {
                            const alpha = (1 - dist / 120) * 50;
                            p.stroke(particles[i].hue, 100, 100, alpha);
                            p.strokeWeight(0.5);
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };

        new p5(sketch);
    }

    // 设置时间显示
    setupTimeDisplay() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    // 设置动画
    setupAnimations() {
        // 页面加载动画 - 修复文字显示问题
        anime({
            targets: '.loading',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(150),
            duration: 800,
            easing: 'easeOutQuart',
            complete: () => {
                document.querySelectorAll('.loading').forEach(el => {
                    el.classList.remove('loading');
                    el.classList.add('loaded');
                });
            }
        });

        // 标题文字动画 - 修复
        Splitting();
        
        anime({
            targets: '.main-title .char',
            opacity: [0, 1],
            translateY: [50, 0],
            rotateZ: [10, 0],
            delay: anime.stagger(50),
            duration: 600,
            easing: 'easeOutExpo'
        });

        // 统计数字动画
        this.animateStats();
        
        // 更新为89分
        gradesData.averageScore = 89;
    }

    // 统计数字动画
    animateStats() {
        const stats = [
            { element: '#average-score', target: 89 },
            { element: '#highest-score', target: 95 },
            { element: '#lowest-score', target: 84 },
            { element: '#total-subjects', target: 9 },
            { element: '#improvement-rate', target: 5.2, suffix: '%', prefix: '+' },
            { element: '#consistency-score', target: 92 }
        ];

        stats.forEach((stat, index) => {
            const element = document.querySelector(stat.element);
            if (element) {
                setTimeout(() => {
                    anime({
                        targets: { value: 0 },
                        value: stat.target,
                        duration: 2000,
                        easing: 'easeOutExpo',
                        update: function(anim) {
                            const value = anim.animatables[0].target.value;
                            const prefix = stat.prefix || '';
                            const suffix = stat.suffix || '';
                            element.textContent = prefix + Math.round(value * 10) / 10 + suffix;
                        }
                    });
                }, index * 200);
            }
        });
    }

    // 生成科目卡片
    generateSubjectCards() {
        const container = document.getElementById('subjects-grid');
        if (!container) return;

        gradesData.subjects.forEach((subject, index) => {
            const gradeInfo = getGradeLevel(subject.totalScore);
            const trend = this.calculateSubjectTrend(subject);
            
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            // 处理PASS科目
            const displayScore = subject.isPassFail ? 
                (subject.exams[0].displayScore || 'PASS') : 
                subject.totalScore;
            
            const displayClass = subject.isPassFail ? 
                'score-excellent' : 
                this.getScoreClass(subject.totalScore);
                
            card.innerHTML = `
                <div class="subject-header">
                    <h3 class="subject-name">${subject.name}</h3>
                    <div class="subject-grade grade-${gradeInfo.grade.toLowerCase().replace('+', 'plus').replace('-', 'minus')}">
                        ${gradeInfo.grade}
                    </div>
                </div>
                <div class="subject-score ${displayClass}">
                    ${displayScore}
                </div>
                <div class="subject-details">
                    <span class="exam-count">${subject.exams.length} 项评估</span>
                    <div class="trend-indicator trend-${trend}">
                        ${this.getTrendIcon(trend)}
                        <span>${this.getTrendText(trend)}</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = `subject.html?id=${subject.id}`;
            });

            container.appendChild(card);

            // 卡片出现动画
            anime({
                targets: card,
                opacity: [0, 1],
                translateY: [30, 0],
                delay: index * 100,
                duration: 600,
                easing: 'easeOutQuart'
            });
        });
    }

    // 计算科目趋势
    calculateSubjectTrend(subject) {
        if (subject.exams.length < 2) return 'stable';
        
        const scores = subject.exams
            .filter(exam => exam.score !== null && exam.score !== undefined)
            .map(exam => exam.score);
        
        return calculateTrend(scores);
    }

    // 获取分数样式类
    getScoreClass(score) {
        if (score >= 90) return 'score-excellent';
        if (score >= 80) return 'score-good';
        if (score >= 70) return 'score-average';
        return 'score-poor';
    }

    // 获取趋势图标
    getTrendIcon(trend) {
        switch (trend) {
            case 'improving': return '↗';
            case 'declining': return '↘';
            default: return '→';
        }
    }

    // 获取趋势文本
    getTrendText(trend) {
        switch (trend) {
            case 'improving': return '进步中';
            case 'declining': return '需努力';
            default: return '稳定';
        }
    }

    // 创建所有图表
    createAllCharts() {
        this.createRadarChart(); // 最重要的雷达图放在首页
        this.createGradeDistributionChart();
        this.createSubjectComparisonChart();
        this.createTrendAnalysisChart();
        this.createDifficultyAnalysisChart();
        this.createComparisonChart();
        this.createDistributionChart();
    }

    // 创建等级分布图表
    createGradeDistributionChart() {
        const chartDom = document.getElementById('grade-distribution-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.gradeDistribution = chart;

        // 统计等级分布
        const gradeCounts = {};
        gradesData.subjects.forEach(subject => {
            const gradeInfo = getGradeLevel(subject.totalScore);
            const grade = gradeInfo.grade;
            gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
        });

        const data = Object.entries(gradeCounts).map(([grade, count]) => ({
            name: grade,
            value: count,
            itemStyle: {
                color: gradesData.gradeLevels[grade]?.color || '#666'
            }
        }));

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: {
                    color: '#fff'
                },
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [{
                name: '等级分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 212, 255, 0.5)'
                    }
                },
                label: {
                    color: '#fff',
                    fontSize: 14,
                    formatter: '{b}\n{c}科'
                },
                labelLine: {
                    lineStyle: {
                        color: '#666'
                    }
                }
            }]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建科目对比图表
    createSubjectComparisonChart() {
        const chartDom = document.getElementById('subject-comparison-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.subjectComparison = chart;

        const subjects = gradesData.subjects.map(subject => subject.name);
        const scores = gradesData.subjects.map(subject => subject.totalScore);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: subjects,
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
                axisLabel: {
                    color: '#fff'
                },
                splitLine: {
                    lineStyle: {
                        color: '#333'
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    data: scores.map((score, index) => ({
                        value: score,
                        itemStyle: {
                            color: this.getScoreColor(score)
                        }
                    })),
                    barWidth: '60%',
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 212, 255, 0.5)'
                        }
                    }
                },
                {
                    type: 'line',
                    data: new Array(subjects.length).fill(gradesData.averageScore),
                    lineStyle: {
                        color: '#ff6b35',
                        type: 'dashed',
                        width: 2
                    },
                    symbol: 'none',
                    name: '平均分线'
                }
            ]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建趋势分析图表
    createTrendAnalysisChart() {
        const chartDom = document.getElementById('trend-analysis-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.trendAnalysis = chart;

        // 模拟趋势数据
        const dates = ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'];
        const trendData = [82, 84, 86, 85, 87, 89, 88, 90];

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: { color: '#fff' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff' }
            },
            yAxis: {
                type: 'value',
                min: 75,
                max: 95,
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff' },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [{
                type: 'line',
                data: trendData,
                lineStyle: { color: '#00d4ff', width: 3 },
                itemStyle: { color: '#00d4ff' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
                        ]
                    }
                },
                smooth: true,
                symbol: 'circle',
                symbolSize: 8
            }]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建难度分析图表
    createDifficultyAnalysisChart() {
        const chartDom = document.getElementById('difficulty-analysis-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.difficultyAnalysis = chart;

        // 计算每个科目的标准差作为难度指标
        const difficultyData = gradesData.subjects.map(subject => {
            // 对于Pass/Fail科目，直接显示为0（稳定）
            if (subject.isPassFail) {
                return {
                    name: subject.name,
                    value: 0,
                    avg: 89,
                    isPass: true
                };
            }
            
            // 对于正常科目，计算标准差
            const scores = subject.exams
                .filter(e => e.score !== null && e.score !== undefined)
                .map(e => e.score);
            
            if (scores.length === 0) {
                return {
                    name: subject.name,
                    value: 0,
                    avg: 0,
                    isPass: false
                };
            }
            
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
            const stdDev = Math.sqrt(variance);
            return {
                name: subject.name,
                value: Math.round(stdDev * 10) / 10,
                avg: Math.round(avg * 10) / 10,
                isPass: false
            };
        });

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: { color: '#fff' },
                formatter: function(params) {
                    const data = params[0];
                    if (data.data.isPass) {
                        return `${data.name}<br/>该科目为通过制<br/>成绩稳定`;
                    }
                    return `${data.name}<br/>标准差: ${data.value}<br/>平均分: ${data.data.avg}分<br/>${data.value < 10 ? '成绩稳定' : data.value < 20 ? '中等波动' : '波动较大'}`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: difficultyData.map(d => d.name),
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff', rotate: 45 }
            },
            yAxis: {
                type: 'value',
                name: '标准差',
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff' },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [{
                type: 'bar',
                data: difficultyData.map(d => ({
                    value: d.value,
                    avg: d.avg,
                    isPass: d.isPass,
                    itemStyle: {
                        color: d.isPass ? '#00ff88' : 
                               d.value < 10 ? '#00d4ff' : 
                               d.value < 20 ? '#8b5cf6' : '#ff6b35'
                    }
                })),
                barWidth: '60%'
            }]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建对比图表
    createComparisonChart() {
        const chartDom = document.getElementById('comparison-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.comparison = chart;

        const subjects = gradesData.subjects.map(s => s.name);
        const scores = gradesData.subjects.map(s => s.totalScore);
        const averageLine = new Array(subjects.length).fill(gradesData.averageScore);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['您的成绩', '平均分'],
                textStyle: { color: '#fff' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: subjects,
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff', rotate: 45 }
            },
            yAxis: {
                type: 'value',
                min: 70,
                max: 100,
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff' },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [
                {
                    name: '您的成绩',
                    type: 'bar',
                    data: scores.map((score, index) => ({
                        value: score,
                        itemStyle: {
                            color: score >= gradesData.averageScore ? '#00ff88' : '#ff6b35'
                        }
                    })),
                    barWidth: '40%'
                },
                {
                    name: '平均分',
                    type: 'line',
                    data: averageLine,
                    lineStyle: { color: '#00d4ff', width: 3 },
                    symbol: 'none'
                }
            ]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建雷达图（首页最重要的图表）
    createRadarChart() {
        const chartDom = document.getElementById('radar-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.radar = chart;

        // 包括所有科目，包括Pass/Fail（使用89分作为Pass的分数）
        const subjects = gradesData.subjects.map(s => s.name);
        const scores = gradesData.subjects.map(s => s.isPassFail ? 89 : s.totalScore);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: { color: '#fff' },
                formatter: function(params) {
                    const data = params[0];
                    return `${data.name}: ${data.value}分`;
                }
            },
            radar: {
                indicator: subjects.map(name => ({ name, max: 100 })),
                center: ['50%', '50%'],
                radius: '70%',
                axisName: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                splitLine: {
                    lineStyle: { 
                        color: '#333',
                        width: 1
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: ['rgba(0, 212, 255, 0.05)', 'rgba(0, 212, 255, 0.1)']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                }
            },
            series: [
                {
                    type: 'radar',
                    data: [{
                        value: scores,
                        name: '成绩',
                        areaStyle: {
                            color: 'rgba(0, 212, 255, 0.3)'
                        },
                        lineStyle: {
                            color: '#00d4ff',
                            width: 3
                        },
                        itemStyle: {
                            color: '#00d4ff',
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        symbol: 'circle',
                        symbolSize: 8
                    }]
                },
                {
                    type: 'radar',
                    data: [{
                        value: new Array(subjects.length).fill(89),
                        name: '平均分',
                        lineStyle: {
                            color: '#ff6b35',
                            width: 2,
                            type: 'dashed'
                        },
                        itemStyle: {
                            color: '#ff6b35'
                        },
                        symbol: 'circle',
                        symbolSize: 6,
                        areaStyle: {
                            color: 'rgba(255, 107, 53, 0.1)'
                        }
                    }]
                }
            ]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建分布图表
    createDistributionChart() {
        const chartDom = document.getElementById('distribution-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.distribution = chart;

        // 统计分数分布
        const ranges = [
            { name: '90-100', min: 90, max: 100, color: '#00ff88' },
            { name: '80-89', min: 80, max: 89, color: '#00d4ff' },
            { name: '70-79', min: 70, max: 79, color: '#8b5cf6' },
            { name: '60-69', min: 60, max: 69, color: '#ff6b35' },
            { name: '0-59', min: 0, max: 59, color: '#ff4757' }
        ];

        const distribution = ranges.map(range => {
            const count = gradesData.subjects.filter(s => 
                s.totalScore >= range.min && s.totalScore <= range.max
            ).length;
            return {
                name: range.name,
                value: count,
                itemStyle: { color: range.color }
            };
        });

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00d4ff',
                textStyle: { color: '#fff' },
                formatter: '{a} <br/>{b}: {c}科 ({d}%)'
            },
            series: [{
                name: '分数分布',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['50%', '50%'],
                data: distribution,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 212, 255, 0.5)'
                    }
                },
                label: {
                    color: '#fff',
                    fontSize: 12
                }
            }]
        };

        chart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 获取分数对应的颜色（90分以下黄色/红色，90分以上蓝色/绿色）
    getScoreColor(score) {
        if (score >= 97) return '#00ff88';      // A+ 绿色
        if (score >= 93) return '#00d4ff';      // A 蓝色
        if (score >= 90) return '#00a8ff';      // A- 浅蓝色
        if (score >= 87) return '#f59e0b';      // B+ 黄色
        if (score >= 84) return '#f97316';      // B 橙色
        if (score >= 81) return '#fb923c';      // B- 浅橙色
        if (score >= 78) return '#ff6b35';      // C+ 橙红色
        if (score >= 75) return '#ff4757';      // C 红色
        if (score >= 72) return '#ff2d55';      // C- 深红色
        return '#ff1a1a';                        // D及以下 深红色
    }

    // 获取分数样式类（90分以下标注为黄色/红色）
    getScoreClass(score) {
        if (score >= 90) return 'score-excellent';
        return 'score-poor'; // 90分以下都标记为需要改进
    }

    // 设置交互
    setupInteractions() {
        // 科目卡片悬停效果
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.subject-card')) {
                const card = e.target.closest('.subject-card');
                anime({
                    targets: card,
                    scale: [1, 1.02],
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.subject-card')) {
                const card = e.target.closest('.subject-card');
                anime({
                    targets: card,
                    scale: [1.02, 1],
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            }
        });

        // 统计卡片点击效果
        document.addEventListener('click', (e) => {
            if (e.target.closest('.stat-card')) {
                const card = e.target.closest('.stat-card');
                anime({
                    targets: card,
                    scale: [1, 0.95, 1],
                    duration: 200,
                    easing: 'easeOutQuart'
                });
            }
        });

        // 导航按钮悬停效果
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('.nav-button')) {
                anime({
                    targets: e.target,
                    scale: [1, 1.05],
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('.nav-button')) {
                anime({
                    targets: e.target,
                    scale: [1.05, 1],
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            }
