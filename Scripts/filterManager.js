filterButton.addEventListener('click', toggleFilter);

function toggleFilter() {
    if (!filterMenu.classList.contains('open')) {
        filterMenu.classList.replace('closed', 'open');
        filterButton.classList.add('is-active');

        if (!filtersEventsInitiated) {
            loadFiltersNames();
            filtersEventsInitiated = true;
        }        
    }
    else {
        resetFilters();
        showAllItems();
        
        filterMenu.classList.replace('open', 'closed');
        filterButton.classList.remove('is-active');
    }
} //ouvre le menu des filtres

function loadFiltersNames() {
    let filterOptions = filterMenu.querySelectorAll('span');

    filterOptions.forEach((filter, index) => {
        const hoverHandler = () => {
            filter.style.backgroundColor = colors[index];
        }

        const unhoverHandler = () => {
            if (!filter.classList.contains('is-active')) {
                filter.style.backgroundColor = 'transparent';
            }
        }

        const clickHandler = () => {            
            if (filter === activeFilter && filter.classList.contains('is-active')) {
                filter.classList.remove('is-active');
                filter.style.backgroundColor = 'transparent';

                filterOptions.forEach((filter) => filter.style.opacity = 1);

                activeFilter = null;

                showAllItems();
            }
            else {
                filterOptions.forEach((filter) => {
                    filter.classList.remove('is-active');
                    filter.style.backgroundColor = 'transparent';
                    filter.style.opacity = 0.7;
                });

                filter.classList.add('is-active');
                filter.style.backgroundColor = colors[index];
                filter.style.opacity = 1;
                activeFilter = filter;

                activateFilter(activeFilter);
            }
        }

        if ($.data(filter, 'events')) {
            $(filter).off('mouseover', hoverHandler);        
            $(filter).off('mouseout', unhoverHandler);        
            $(filter).off('click', clickHandler);
        } //supprimer les events

        filter.addEventListener('mouseover', hoverHandler);    
        filter.addEventListener('mouseout', unhoverHandler);    
        filter.addEventListener('click', clickHandler);
    });
} //récupère les noms des labels et ajoute les listeners aux filtres 

function activateFilter(activeFilter) {
    const listItems = document.querySelectorAll('#list-container li');

    listItems.forEach((item) => {
        const labelText = item.querySelector('#label-modal p').innerText;
        
        if (labelText === activeFilter.innerText) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    })
} //active le filtre choisi

function showAllItems() {
    const listItems = document.querySelectorAll('#list-container li');

    listItems.forEach((item) => {
        item.style.display = 'flex';
    });
} //montre tous les items

function resetFilters() {
    const filtersLabel = filterMenu.querySelectorAll('span');

    filtersLabel.forEach((filter) => {
        filter.classList.remove('is-active');
        filter.style.backgroundColor = 'transparent';
        filter.style.opacity = 1;
    });

    activeFilter = null;

       
} //reset les filtres