/**
 * Swiper スライダー設定
 */
window.onload = function () {
  const mySwiper = new Swiper(".swiper-containerMain", {
    loop: false,
    effect: "fade",
    speed: 1500,
    slidesPerView: "auto",
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      767: {
        slidesPerView: 1,
        spaceBetween: 0
      }
    }
  });
};

/* 
画像ダウンロード
*/
// 任意画像ダウンロード関数
function download() {
  // サムネイル要素取得
  const imgLinks = document.querySelectorAll(
    ".swiper-wrapper .swiper-slide img"
  );
  // サムネイル数
  const imgCount = imgLinks.length;
  // ダイアログ値取得
  const result = window.prompt(
    "何番目のサムネイル画像を開きますか？\nこのページでは" +
    imgCount +
    "番目まで選択できます。",
    1
  );
  // 自然数変換
  const imgNumber = Number(result) - 1;

  // 入力確認
  if (result == null) {
    window.alert("キャンセルされました。");
  } else {
    if (imgNumber <= imgCount) {
      // 画像URL取得
      const url = imgLinks[imgNumber].src;
      // 画像名取得
      const fileName = "download-file" + (imgNumber + 1);
      const link = document.createElement("a");
      // ダウンロード用リンク設定
      link.href = url;
      link.download = fileName;
      // aタグ作成
      document.body.appendChild(link);
      // リンククリック
      link.click();
      // aタグ削除
      document.body.removeChild(link);
    } else {
      window.alert("正しいサムネイル番号を入力してください！");
    }
  }
}

// 全画像ダウンロード関数
function downloadAll() {
  // サムネイル要素取得
  const imgLinks = document.querySelectorAll(
    ".swiper-container .swiper-slide img"
  );
  imgLinks.forEach((value, index) => {
    const url = value.src;
    // 画像名取得
    const fileName = "download-file" + index;
    const link = document.createElement("a");
    // ダウンロード用リンク設定
    link.href = url;
    link.download = fileName;
    // aタグ作成
    document.body.appendChild(link);
    // リンククリック
    link.click();
    // aタグ削除
    document.body.removeChild(link);
  });
}