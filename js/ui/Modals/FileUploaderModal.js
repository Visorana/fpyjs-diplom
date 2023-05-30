/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
   constructor( element ) {
      super(element);
      this.element = element;
      this.imageContainer = element.querySelector('.scrolling.content');
      this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
   registerEvents(){
      const closeButton = this.element.querySelector('.x.icon');
      const sendAllButton = this.element.querySelector('.send-all');

      closeButton.addEventListener('click', () => {
         this.close();
      });

      sendAllButton.addEventListener('click', () => {
         this.sendAllImages();
      });

      this.imageContainer.addEventListener('click', (event) => {
         const target = event.target;
         const imageContainer = target.closest('.image-preview-container');
         if (target.tagName == 'INPUT') {
            target.classList.remove('error');
         } else if (target.tagName == 'I') {
            this.sendImage(imageContainer);
         }
      });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
   showImages(images) {
      const imageArray = Array.from(images);
      const imageMarkup = imageArray.reverse().map((item) => this.getImageHTML(item)).join('');
      this.imageContainer.innerHTML = imageMarkup;
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
   getImageHTML(item) {
      return `<div class="image-preview-container">
                  <img src='${item.src}' />
                  <div class="ui action input">
                     <input type="text" placeholder="File path">
                     <button class="ui button"><i class="upload icon"></i></button>
                  </div>
               </div>`;
   }

  /**
   * Отправляет все изображения в облако
   */
   sendAllImages() {
      const imageContainers = this.element.querySelectorAll('.image-preview-container');
      imageContainers.forEach((container) => {
         this.sendImage(container);
      });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
   sendImage(imageContainer) {
      const inputField = imageContainer.querySelector('input');
      const imagePath = inputField.value.trim()

      if (imagePath == '') {
         imageContainer.classList.add('error');
         return;
      }

      inputField.disabled = true;

      const imageElement = imageContainer.querySelector('img');
      const imageUrl = imageElement.src;

      Yandex.uploadFile(imagePath, imageUrl, () => {
         imageContainer.remove();
         const remainingImages = this.element.querySelectorAll('.image-preview-container');
         if (remainingImages.length == 0) {
            this.close();
         }
      });
   }
}