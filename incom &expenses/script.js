document.addEventListener('DOMContentLoaded', function () {
    const entryForm = document.getElementById('entryForm');
    const entryList = document.getElementById('entryList');
    const totalIncomeDisplay = document.getElementById('totalIncome');
    const totalExpensesDisplay = document.getElementById('totalExpenses');
    const balanceDisplay = document.getElementById('balance');
    const editModal = document.getElementById('editModal');
    const closeButton = document.querySelector('.close-button');
    const editForm = document.getElementById('editForm');
    const filterRadios = document.querySelectorAll('input[name="filter"]');
    let entries = JSON.parse(localStorage.getItem('entries') || '[]');
    let currentFilter = 'all'; // Default filter

    function updateSummary() {
        let totalIncome = 0;
        let totalExpenses = 0;
        entries.forEach(entry => {
            if (entry.type === 'income') {
                totalIncome += parseFloat(entry.amount);
            } else {
                totalExpenses += parseFloat(entry.amount);
            }
        });
        totalIncomeDisplay.textContent = totalIncome.toFixed(2);
        totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
        const balance = totalIncome - totalExpenses;
        balanceDisplay.textContent = balance.toFixed(2);
    }
    function filterEntries(){
         let filteredEntries = entries;
          if (currentFilter !== 'all') {
            filteredEntries = entries.filter(entry => entry.type === currentFilter);
           }
           return filteredEntries;
    }

    function renderEntries() {
        entryList.innerHTML = '';
        const filteredEntries = filterEntries();
        filteredEntries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.classList.add(entry.type);
            li.innerHTML = `
                <span>${entry.description}:</span>
                <span>$${entry.amount.toFixed(2)}</span>
                <div class="entry-actions">
                    <button class="edit-button" data-index="${index}">Edit</button>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </div>
            `;
            entryList.appendChild(li);
        });
    }

    function saveEntries() {
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    entryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        if(isNaN(amount) || amount <=0)
        {
          alert("Please enter valid amount")
          return;
        }
        const newEntry = { type, description, amount };
        entries.push(newEntry);
        saveEntries();
        renderEntries();
        updateSummary();
        entryForm.reset();
    });
    entryList.addEventListener('click', function (e) {
      if (e.target.classList.contains('delete-button')) {
          const index = parseInt(e.target.getAttribute('data-index'), 10);
          entries.splice(index, 1);
          saveEntries();
          renderEntries();
          updateSummary();
      }
       if (e.target.classList.contains('edit-button')) {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
            const entry = entries[index];
            document.getElementById('editType').value = entry.type;
            document.getElementById('editDescription').value = entry.description;
            document.getElementById('editAmount').value = entry.amount;
             document.getElementById('editIndex').value= index;
            editModal.style.display = 'block';
        }
  });
  editForm.addEventListener('submit', function(e){
    e.preventDefault();
    const index = parseInt(document.getElementById('editIndex').value,10);
    const type = document.getElementById('editType').value;
    const description = document.getElementById('editDescription').value;
    const amount = parseFloat(document.getElementById('editAmount').value);
    if(isNaN(amount) || amount <=0)
        {
          alert("Please enter valid amount")
          return;
        }
    entries[index] = {type , description,amount}
    saveEntries();
    renderEntries();
    updateSummary();
    editModal.style.display = 'none';
  });

  closeButton.addEventListener('click', function(){
    editModal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target == editModal) {
      editModal.style.display = "none";
    }
  });
  filterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentFilter = this.value;
            renderEntries();
        });
    });
   document.querySelectorAll('.reset-button').forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('data-input');
            document.getElementById(inputId).value = '';
        });
    });
    renderEntries();
    updateSummary();
});