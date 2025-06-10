
fetch('lawbook_data.json')
  .then(res => res.json())
  .then(data => {
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const lawbookDiv = document.getElementById('lawbook');

    const categories = [...new Set(data.map(item => item.Category))].sort();
    categories.forEach(category => {
      const opt = document.createElement('option');
      opt.value = category;
      opt.textContent = category;
      categoryFilter.appendChild(opt);
    });

    function createCard(item) {
      return `
        <div class="card">
          <h3>§${item.Code} - ${item.Charge}</h3>
          <p><strong>Type:</strong> ${item.Type}</p>
          <p><strong>Sentence:</strong> ${item.Sentence}</p>
          <p><strong>Fine:</strong> $${item.Fine}</p>
          <p><strong>Revoke Driver License:</strong> ${item.Revoke_Driver_License === 'X' ? '✅' : 'No'}</p>
          <p><strong>Revoke Weapons License:</strong> ${item.Revoke_Weapons_License === 'X' ? '✅' : 'No'}</p>
          <p><strong>Definition:</strong> ${item.Definition}</p>
        </div>`;
    }

    function render(dataSet) {
      lawbookDiv.innerHTML = '';
      const grouped = {};

      dataSet.forEach(item => {
        if (!grouped[item.Category]) grouped[item.Category] = [];
        grouped[item.Category].push(item);
      });

      Object.entries(grouped).forEach(([category, items]) => {
        const section = document.createElement('div');
        section.className = 'category-group';

        const title = document.createElement('h2');
        title.textContent = category;
        title.onclick = () => {
          container.classList.toggle('hidden');
        };

        const container = document.createElement('div');
        container.className = 'card-container';

        items.forEach(item => {
          container.innerHTML += createCard(item);
        });

        section.appendChild(title);
        section.appendChild(container);
        lawbookDiv.appendChild(section);
      });
    }

    function filterData() {
      const term = searchInput.value.toLowerCase();
      const cat = categoryFilter.value;

      const filtered = data.filter(item =>
        (item.Charge.toLowerCase().includes(term) ||
         item.Code.includes(term) ||
         (item.Type && item.Type.toLowerCase().includes(term))) &&
        (cat === '' || item.Category === cat)
      );

      render(filtered);
    }

    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);

    render(data);
  });
