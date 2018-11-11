// eslint-disable-next-line func-names
window.onload = function () {
  let arrayListen;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '../json/data.json', true);

  class Module {
    constructor(modal, informArray) {
      const that = this;
      this.body = modal;
      this.currentSlide = 0;
      this.helpLength = 0;
      this.informArray = informArray;
      this.finalInformArray = [];
      this.postText();
      this.postDots();
      this.arrayDots = document.querySelectorAll('.modal .paging_dots .dot');
      this.arrayHelps = document.querySelectorAll('.modal .help_section .help_text');
      this.inputEmersion = document.getElementById('check_emers');
      this.setActiveElements(0, false);
      this.body.addEventListener('focus', () => {
        this.body.addEventListener('keydown', (e) => {
          const keyPrev = 37;
          const keyNext = 39;
          const keyESC = 27;
          if (e.keyCode === keyPrev) {
            that.prevSlide();
          }
          if (e.keyCode === keyNext) {
            that.nextSlide();
          }
          if (e.keyCode === keyESC) {
            that.close();
          }
        }, true);
      });
      this.body.addEventListener('click', (e) => {
        const elemAttr = e.target.getAttribute('data-click');
        if (elemAttr === 'btn-close') {
          that.close();
        }
        if (elemAttr === 'btn-dot') {
          that.dotsClick(Number(e.target.getAttribute('data-index')));
        }
        if (elemAttr === 'btn-next') {
          that.nextSlide();
        }
        if (elemAttr === 'btn-prev') {
          that.prevSlide();
        }
        if (elemAttr === 'input-emers') {
          that.getEmersionValue();
        }
      });
    }

    close() {
      this.body.classList.remove('active');
    }

    open() {
      this.body.classList.add('active');
    }

    prevSlide() {
      if (this.currentSlide === 0) {
        this.setActiveElements(this.helpLength - 1, this.currentSlide);
      } else {
        this.setActiveElements(this.currentSlide - 1, this.currentSlide);
      }
    }

    nextSlide() {
      if ((this.currentSlide + 1) === this.helpLength) {
        this.setActiveElements(0, this.currentSlide);
      } else {
        this.setActiveElements(this.currentSlide + 1, this.currentSlide);
      }
    }

    dotsClick(index) {
      this.setActiveElements(index, this.currentSlide);
    }

    innerDot() {
      const arrDot = [];
      for (let i = 0; i < this.helpLength; i += 1) {
        arrDot[i] = `<div data-index="${i}" data-click="btn-dot" class="dot"></div>`;
      }
      return arrDot;
    }

    postDots() {
      const html = this.innerDot();
      const root = document.getElementById('paging');
      const div = document.createElement('div');
      div.classList.add('paging_dots');
      div.innerHTML = html;
      root.appendChild(div);
    }

    innerText() {
      return this.finalInformArray.map(item => `<div class="title">${item.title}</div><p>${item.text}</p>`);
    }

    renderText() {
      const html = this.innerText();
      this.helpLength = html.length;
      const root = document.getElementById('tips');
      for (let i = 0; i < this.helpLength; i += 1) {
        const div = document.createElement('div');
        div.classList.add('help_text');
        div.setAttribute('data-index', i);
        div.innerHTML = html[i];
        root.appendChild(div);
      }
    }

    postText() {
      if (this.informArray.length > 7) {
        this.finalInformArray = this.informArray.slice(0, 7);
      } else {
        this.finalInformArray = this.informArray.slice(0, this.informArray.length);
      }
      this.renderText();
    }

    getEmersionValue() {
      if (this.inputEmersion.checked === true) {
        localStorage.setItem('emersion', false);
      } else {
        localStorage.setItem('emersion', true);
      }
    }

    setActiveElements(set, remove) {
      this.arrayDots.forEach((elem) => {
        const dataAttr = Number(elem.getAttribute('data-index'));
        if (dataAttr === remove) {
          elem.classList.remove('active');
        }
        if (dataAttr === set) {
          elem.classList.add('active');
        }
      });

      this.arrayHelps.forEach((elem) => {
        const dataAttr = Number(elem.getAttribute('data-index'));
        if (dataAttr === remove) {
          elem.classList.remove('active');
        }
        if (dataAttr === set) {
          elem.classList.add('active');
        }
      });

      this.currentSlide = set;
    }
  }
  // eslint-disable-next-line func-names
  xhr.onreadystatechange = function () {
    if (Number(xhr.status) === 200 && Number(xhr.readyState) === 4) {
      arrayListen = JSON.parse(xhr.responseText).test;
      if (localStorage.getItem('emersion') === null || localStorage.getItem('emersion') === 'true') {
        localStorage.setItem('emersion', true);
        const modal = document.querySelector('#modal');
        const ModalObj = new Module(modal, arrayListen);
        setTimeout(() => { ModalObj.open(); }, 5000);
      }
    }
  };
  xhr.send();
};
