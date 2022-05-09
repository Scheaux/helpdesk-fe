export default class App {
  static init() {
    this.allTickets = [];
    App.initEventListeners();
    App.getAllTickets();
  }

  static initEventListeners() {
    App.initTicketCreation();
    App.initTicketEditing();
    App.initModalClose();
    App.initTableClicks();
    App.initDeletionListener();
  }

  static initTicketCreation() {
    const addTicketBtn = document.getElementById('plus_btn');
    const modal = document.getElementById('add-ticket-form');
    addTicketBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal_save')) {
        const name = modal.querySelector('.modal_name .modal_input');
        const desc = modal.querySelector('.modal_description .modal_input');
        App.addNewTicket(name.value, desc.value);
        modal.classList.add('hidden');
        name.value = '';
        desc.value = '';
      }
    });
  }

  static initTicketEditing() {
    const modal = document.getElementById('edit-ticket-form');
    const modalEdit = modal.querySelector('.modal_edit');
    modalEdit.addEventListener('click', () => {
      const name = modal.querySelector('.modal_name .modal_input');
      const desc = modal.querySelector('.modal_description .modal_input');
      const { id } = this.selectedToEdit.dataset;
      const ticket = {
        id,
        name: name.value,
        description: desc.value,
      };
      const secure = new URLSearchParams(Object.entries(ticket)).toString();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://helpdeskbe.herokuapp.com/?method=editTicket');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            App.getAllTickets();
          }
        }
      });
      xhr.send(secure);
      modalEdit.closest('.modal').classList.add('hidden');
      name.value = '';
      desc.value = '';
    });
  }

  static initModalClose() {
    const modalClose = document.querySelectorAll('.modal_close');
    modalClose.forEach((e) => {
      e.addEventListener('click', () => {
        e.closest('.modal').classList.add('hidden');
      });
    });
  }

  static addNewTicket(name, description) {
    const ticket = {
      id: null,
      name,
      description,
      status: false,
      created: App.getCurrentTime(),
    };
    const secure = new URLSearchParams(Object.entries(ticket)).toString();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://helpdeskbe.herokuapp.com/?method=createTicket');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          App.getAllTickets();
        }
      }
    });
    xhr.send(secure);
  }

  static initTableClicks() {
    const table = document.getElementById('table');
    table.addEventListener('click', (e) => {
      if (e.target.classList.contains('cross')) {
        this.marked = e.target.closest('.ticket');
        document.getElementById('delete-ticket-form').classList.remove('hidden');
      } else if (e.target.classList.contains('edit')) {
        const editTicketModal = document.getElementById('edit-ticket-form');
        this.selectedToEdit = e.target.closest('.ticket');
        editTicketModal.classList.remove('hidden');
      } else if (e.target.classList.contains('checkmark')) {
        const checkbox = e.target.previousElementSibling;
        const { id } = e.target.closest('.ticket').dataset;
        if (checkbox.checked) {
          checkbox.checked = false;
        } else {
          checkbox.checked = true;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://helpdeskbe.herokuapp.com/?method=changeStatus&id=${id}`);
        xhr.send();
      } else {
        App.showFullTicket(e.target.closest('.ticket'));
      }
    });
  }

  static renderTickets() {
    const table = document.getElementById('table');
    table.innerHTML = '';
    this.allTickets.forEach((e) => {
      if (e.status) {
        table.innerHTML += `
        <div class="ticket" data-id="${e.id}">
          <div class="ticket_content">
            <input type="checkbox" class="ticket_checkbox hidden" checked />
            <span class="checkmark"></span>
            <span class="ticket_text">${e.name}</span>
            <span class="date">${e.created}</span>
            <div class="ticket_tools">
              <button class="edit">✎</button>
              <button class="cross">✕</button>
            </div>
          </div>
        </div>
      `;
      } else {
        table.innerHTML += `
        <div class="ticket" data-id="${e.id}">
          <div class="ticket_content">
            <input type="checkbox" class="ticket_checkbox hidden" />
            <span class="checkmark"></span>
            <span class="ticket_text">${e.name}</span>
            <span class="date">${e.created}</span>
            <div class="ticket_tools">
              <button class="edit">✎</button>
              <button class="cross">✕</button>
            </div>
          </div>
        </div>
      `;
      }
    });
  }

  static initDeletionListener() {
    const deleteBtn = document.getElementById('modal-delete');
    const modal = document.getElementById('delete-ticket-form');
    deleteBtn.addEventListener('click', () => {
      if (this.marked) {
        const { id } = this.marked.dataset;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://helpdeskbe.herokuapp.com/?method=deleteTicket&id=${id}`);
        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              App.getAllTickets();
            }
          }
        });
        xhr.send();
      }
      modal.classList.add('hidden');
    });
  }

  static getAllTickets() {
    App.showLoading();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://helpdeskbe.herokuapp.com/?method=allTickets');
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.allTickets = JSON.parse(xhr.response);
          App.renderTickets();
        }
      }
    });
    xhr.send();
  }

  static showLoading() {
    const table = document.getElementById('table');
    table.innerHTML = `
      <div class="loadingio-spinner-spin-g6050w4ymch">
        <div class="ldio-msod7n1f0ms">
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
        </div>
      </div>
    `;
  }

  static getCurrentTime() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    const year = `${date.getFullYear()}`.split('');
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    year.splice(0, 2);
    return `${day}.${month}.${year.join('')} ${hours}:${minutes}`;
  }

  static showFullTicket(target) {
    const desc = target.querySelector('.ticket_description');
    if (!desc) {
      const { id } = target.dataset;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://helpdeskbe.herokuapp.com/?method=ticketById&id=${id}`);
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.response);
            const ticketDescription = document.createElement('span');
            ticketDescription.classList.add('ticket_description');
            ticketDescription.innerText = response.description;
            target.appendChild(ticketDescription);
          }
        }
      });
      xhr.send();
    } else {
      desc.remove();
    }
  }
}
