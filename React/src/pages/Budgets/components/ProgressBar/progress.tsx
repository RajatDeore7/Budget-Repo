import _ from 'lodash';
const MyComponent = () => {
    const clonedCategory = {};
    
    var value1  = localStorage.getItem('Income');
    var value2  = localStorage.getItem('Expense');
    
    let num1 = Number(value1);
    let num2 = Number(value2);

    var percentage = (+num2/+num1)*100;
    percentage = Math.min(percentage, 100); // Cap percentage at 100
    percentage = Math.round(percentage); 
    
    console.log(percentage);

    // process
    const income = 50;
    const expense = percentage;

    const incoStyle = {
        height: '17px',
        backgroundColor: income > 50 ? 'red' : 'green',
        borderRadius: '20px',
        border: '2px solid black',
        width: `${income}%`,
        transition: 'width 1s ease-in-out',
    };
    const expStyle = {
        height: '17px',
        backgroundColor: expense > 50 ? 'red' : 'green',
        borderRadius: '20px',
        border: '2px solid black',
        width: `${expense}%`,
        transition: 'width 1s ease-in-out',
    };

    
    return clonedCategory && (
        <div className="row mb-3">
            <div className="progressbar">
                <p className='inco-name'>Income : ${value1}</p>
                <div className="income">
                    <div><p className='perc'>{income}%</p></div>
                    <div className='outer'>
                        <div className="inco" style={incoStyle}></div>
                    </div>
                </div>
                <p className='exp-name'>Expenses : ${value2}</p>
                <div className="income">
                    <div><p className='perc'>{percentage}%</p></div>
                    <div className='outer'>
                        <div className="inco" style={expStyle}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyComponent;