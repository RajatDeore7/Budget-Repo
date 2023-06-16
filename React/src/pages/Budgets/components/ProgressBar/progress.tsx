import { useState, useEffect } from 'react';

const MyComponent = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const value1 = localStorage.getItem('Income');
    const value2 = localStorage.getItem('Expense');
    console.log(value1);

    let num1 = Number(value1);
    let num2 = Number(value2);

    let calculatedPercentage = 0;
    if (num1 !== 0) {
      calculatedPercentage = (+num2 / +num1) * 100;
      calculatedPercentage = Math.min(calculatedPercentage, 100);
      calculatedPercentage = Math.round(calculatedPercentage);
    }

    setIncome(num1 !== 0 ? 100 - calculatedPercentage : 0);
    setExpense(calculatedPercentage);
    setPercentage(calculatedPercentage);
  }, []);

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
    backgroundColor: expense > income ? 'red' : 'green',
    borderRadius: '20px',
    border: '2px solid black',
    width: `${expense}%`,
    transition: 'width 1s ease-in-out',
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const value1 = localStorage.getItem('Income');
      const value2 = localStorage.getItem('Expense');

      let num1 = Number(value1);
      let num2 = Number(value2);

      let calculatedPercentage = 0;
      if (num1 !== 0) {
        calculatedPercentage = (+num2 / +num1) * 100;
        calculatedPercentage = Math.min(calculatedPercentage, 100);
        calculatedPercentage = Math.round(calculatedPercentage);
      }

      setIncome(num1 !== 0 ? 100 - calculatedPercentage : 0);
      setExpense(calculatedPercentage);
      setPercentage(calculatedPercentage);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="row mb-3">
      <div className="progressbar">
        <p className="inco-name">
          Income : ${localStorage.getItem('Income')} ({income}%)
        </p>
        <div className="income">
          <div className="outer">
            <div className="inco" style={incoStyle}></div>
          </div>
        </div>
        <p className="exp-name">
          Expenses : ${localStorage.getItem('Expense')} ({percentage}%)
        </p>
        <div className="income">
          <div className="outer">
            <div className="inco" style={expStyle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
