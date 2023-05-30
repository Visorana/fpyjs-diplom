/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {
  static ACCESS_TOKEN = '';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    VK.lastCallback = callback;
    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${VK.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
    document.body.appendChild(script);
    window.vkCallback = (result) => {
      VK.processData(result);
    };
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    const script = document.querySelector('script[src^="https://api.vk.com/method/photos.get"]');
    if (script) {
      script.remove();
    }
    if (result.error) {
      alert(result.error.error_msg);
      return;
    }
    const images = [];
    for (const item of result.response.items) {
      let sizes = item.sizes;
      let max_size = sizes.reduce((prev, current) => {
        const prevArea = prev.width * prev.height;
        const currentArea = current.width * current.height;
        return prevArea > currentArea ? prev : current;
      });
      images.push(max_size.url);
    }
    VK.lastCallback(images);
    VK.lastCallback = () => {};
  }
};