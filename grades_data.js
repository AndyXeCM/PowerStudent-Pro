// 成绩数据结构
const gradesData = {
    // 等级系统
    gradeLevels: {
        'A+': { min: 97, max: 100, color: '#00ff88' },
        'A': { min: 93, max: 96, color: '#00d4ff' },
        'A-': { min: 90, max: 92, color: '#00a8ff' },
        'B+': { min: 87, max: 89, color: '#8b5cf6' },
        'B': { min: 84, max: 86, color: '#a855f7' },
        'B-': { min: 81, max: 83, color: '#c084fc' },
        'C+': { min: 78, max: 80, color: '#f59e0b' },
        'C': { min: 75, max: 77, color: '#f97316' },
        'C-': { min: 72, max: 74, color: '#fb923c' },
        'D+': { min: 69, max: 71, color: '#ef4444' },
        'D': { min: 66, max: 68, color: '#dc2626' },
        'D-': { min: 63, max: 65, color: '#b91c1c' },
        'F': { min: 0, max: 62, color: '#7f1d1d' }
    },

    // 平均分
    averageScore: 89,

    // 科目数据
    subjects: [
        {
            id: 'general-english',
            name: 'General English',
            exams: [
                { name: '第一次考试', score: 74, fullScore: 100 },
                { name: '第二次考试', score: 90, fullScore: 100 },
                { name: '第三次考试', score: 86, fullScore: 100 }
            ],
            totalScore: 86,
            hasTotal: true
        },
        {
            id: 'pre-ap-english',
            name: 'Pre-AP English',
            exams: [
                { name: '第一次考试', score: 95, fullScore: 100 },
                { name: '第二次考试', score: 100, fullScore: 100 },
                { name: '第三次考试', score: 86, fullScore: 100 },
                { name: '第四次考试', score: 89, fullScore: 100 },
                { name: '平时分', score: 95, fullScore: 100 }
            ],
            totalScore: 93,
            hasTotal: true
        },
        {
            id: 'mathematics',
            name: '数学',
            exams: [
                { name: '第一次考试', score: 91, fullScore: 100 },
                { name: '第二次考试', score: 41, fullScore: 100 },
                { name: '第三次考试', score: 78, fullScore: 100 },
                { name: '第四次考试', score: 68, fullScore: 100 },
                { name: '第五次考试', score: 86, fullScore: 100 },
                { name: 'Project', score: 95, fullScore: 100 },
                { name: '平时分', score: 90, fullScore: 100 }
            ],
            totalScore: 84,
            hasTotal: true
        },
        {
            id: 'german',
            name: '德语',
            exams: [
                { name: '最终成绩', score: null, fullScore: 100, status: 'pass', displayScore: 'PASS' }
            ],
            totalScore: 89,
            hasTotal: false,
            isPassFail: true
        },
        {
            id: 'english-cc',
            name: 'English C&C',
            exams: [
                { name: '第一次考试', score: 73, fullScore: 100 },
                { name: '第二次考试', score: 57, fullScore: 100 },
                { name: '第三次考试', score: 80, fullScore: 100 },
                { name: 'Presentation', score: 100, fullScore: 100 },
                { name: 'Essay', score: 90, fullScore: 100 },
                { name: '第四次考试', score: 50, fullScore: 100 }
            ],
            totalScore: 90,
            hasTotal: true
        },
        {
            id: 'biology',
            name: '生物',
            exams: [
                { name: 'Project', score: 100, fullScore: 100 },
                { name: '第一次考试', score: 88, fullScore: 100 },
                { name: '第二次考试', score: 98, fullScore: 100 },
                { name: '第三次考试', score: 90, fullScore: 100 }
            ],
            totalScore: 95,
            hasTotal: true
        },
        {
            id: 'chemistry',
            name: '化学',
            exams: [
                { name: '第一次考试', score: 78, fullScore: 100 },
                { name: '第二次考试', score: 68, fullScore: 100 },
                { name: '第三次考试', score: 92, fullScore: 100 },
                { name: '期末考', score: 88, fullScore: 100 },
                { name: '实验报告', score: 96, fullScore: 100 },
                { name: 'Project', score: 95, fullScore: 100 }
            ],
            totalScore: 90,
            hasTotal: true
        },
        {
            id: 'chinese',
            name: '中文',
            exams: [
                { name: '第一次考试', score: 81, fullScore: 100 },
                { name: 'Project', score: 95, fullScore: 100 },
                { name: '第二次考试', score: 91, fullScore: 100 },
                { name: '演讲', score: 97, fullScore: 100 },
                { name: '第三次考试', score: 96, fullScore: 100 },
                { name: '期末考', score: 88, fullScore: 100 }
            ],
            totalScore: 92,
            hasTotal: true
        },
        {
            id: 'pe',
            name: '体育',
            exams: [
                { name: '最终成绩', score: null, fullScore: 100, status: 'pass', displayScore: 'PASS' }
            ],
            totalScore: 89,
            hasTotal: false,
            isPassFail: true
        },
        {
            id: 'physics',
            name: '物理',
            exams: [
                { name: '第一次考试', score: 48, fullScore: 70 },
                { name: '第二次考试', score: 56, fullScore: 70 },
                { name: '第三次考试', score: 31, fullScore: 70 },
                { name: '第四次考试', score: 56, fullScore: 70 },
                { name: 'Project', score: 96, fullScore: 100 },
                { name: '期末考', score: 78, fullScore: 100 }
            ],
            totalScore: 76,
            hasTotal: true
        }
    ]
};

// 获取等级信息
function getGradeLevel(score) {
    if (score === null || score === undefined) return null;
    
    for (const [grade, range] of Object.entries(gradesData.gradeLevels)) {
        if (score >= range.min && score <= range.max) {
            return { grade, ...range };
        }
    }
    return { grade: 'F', ...gradesData.gradeLevels['F'] };
}

// 计算趋势
function calculateTrend(scores) {
    if (scores.length < 2) return 'stable';
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg - firstAvg > 2) return 'improving';
    if (firstAvg - secondAvg > 2) return 'declining';
    return 'stable';
}

// 导出数据（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gradesData, getGradeLevel, calculateTrend };
}