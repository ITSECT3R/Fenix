const cashFromCustomer = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const totalPurchase = document.getElementById('total');
const changeToCustomer = document.getElementById('change-due');
const changeInDrawer = document.getElementById('change-in-drawer');

let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

// Initialize total price display
totalPurchase.textContent = `$${price.toFixed(2)}`;

const denominations = [
  { name: "ONE HUNDRED", value: 10000 },
  { name: "TWENTY", value: 2000 },
  { name: "TEN", value: 1000 },
  { name: "FIVE", value: 500 },
  { name: "ONE", value: 100 },
  { name: "QUARTER", value: 25 },
  { name: "DIME", value: 10 },
  { name: "NICKEL", value: 5 },
  { name: "PENNY", value: 1 }
];

function checkCashRegister() {
  const cash = parseFloat(cashFromCustomer.value);
  if (isNaN(cash)) {
    alert("Please enter a valid number");
    return;
  }

  const priceCents = Math.round(price * 100);
  const cashCents = Math.round(cash * 100);
  let changeDueCents = cashCents - priceCents;

  if (changeDueCents < 0) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (changeDueCents === 0) {
    changeToCustomer.textContent = "No change due - customer paid with exact cash";
    return;
  }

  const cidCents = cid.map(([name, amount]) => [name, Math.round(amount * 100)]);
  const totalCIDCents = cidCents.reduce((sum, [, amount]) => sum + amount, 0);

  if (totalCIDCents < changeDueCents) {
    displayResult("INSUFFICIENT_FUNDS", []);
    return;
  }

  if (totalCIDCents === changeDueCents) {
    const result = [...cid];
    // Update the cash drawer - empty it
    cid.forEach((denomination, index) => {
      cid[index][1] = 0;
    });
    displayResult("CLOSED", result);
    return;
  }

  let change = [];
  let remaining = changeDueCents;

  for (const denom of denominations) {
    const cidEntry = cidCents.find(([name]) => name === denom.name);
    if (!cidEntry) continue;

    const [name, available] = cidEntry;
    const value = denom.value;

    let maxCount = Math.floor(available / value);
    let neededCount = Math.floor(remaining / value);
    let count = Math.min(maxCount, neededCount);

    if (count > 0) {
      const amount = count * value;
      remaining -= amount;
      change.push([name, amount / 100]);
      
      // Update the cash drawer amounts
      const cidIndex = cid.findIndex(item => item[0] === name);
      if (cidIndex !== -1) {
        cid[cidIndex][1] -= amount / 100;
      }
    }

    if (remaining === 0) break;
  }

  if (remaining > 0) {
    displayResult("INSUFFICIENT_FUNDS", []);
  } else {
    displayResult("OPEN", change);
  }
}

function displayResult(status, change) {
  let message = `<div>Status: ${status}</div>`;
  
  if (status === "INSUFFICIENT_FUNDS") {
    message += "<div>Not sufficient change in drawer</div>";
  } else if (status === "CLOSED") {
    change.forEach(([name, amount]) => {
      if (amount > 0) message += `<div>${name}: $${formatAmount(amount)}</div>`;
    });
  } else if (status === "OPEN") {
    change.forEach(([name, amount]) => {
      message += `<div>${name}: $${formatAmount(amount)}</div>`;
    });
  }
  
  changeToCustomer.innerHTML = message;
  displayChangeInDrawer(cid);
}

function formatAmount(amount) {
  return amount.toFixed(2).replace(/\.?0+$/, '');
}

function displayChangeInDrawer(change) {
  let message = "";
  change.forEach(([name, amount]) => {
    message += `<div>${name}: $${amount.toFixed(2)}</div>`;
  });
  changeInDrawer.innerHTML = message;
}

purchaseBtn.addEventListener('click', checkCashRegister);
cashFromCustomer.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkCashRegister(); }
);