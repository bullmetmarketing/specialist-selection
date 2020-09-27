"use strict";

var main = function main() {
  var selectors = new (function () {
    this.page = document.querySelector("body");
    this.brSwiper = this.page.querySelector(".br-swiper");
    this.brSwiperContainer = this.brSwiper.querySelector(
      ".br-swiper-container"
    );
    this.brSwiperLeftButton = this.brSwiperContainer.querySelector(
      ".left-button"
    );
    this.brSwiperRightButton = this.brSwiperContainer.querySelector(
      ".right-button"
    );
    this.brSwiperWrapper = this.brSwiperContainer.querySelector(
      ".br-swiper-wrapper"
    );
    this.brSwiperProductInfo = this.brSwiperContainer.querySelector(
      ".br-swipe-product-info-title"
    );
    this.brSwiperProductPrize = this.brSwiperContainer.querySelector(
      ".br-swipe-product-info-prize"
    );
    this.brSwiperProductCTA = this.brSwiperContainer.querySelector(
      ".br-swipe-product-info a"
    );
    this.brSwiperProductCounter = this.brSwiperContainer.querySelector(
      ".br-swipper-product-counter"
    );
    this.brSwiperFocus;
    this.brSwiperNext;
    this.brSwiperPrev;
  })();
  var model = new (function () {
    this.swiperMainPosition = 0;
    this.containerWidth = 0;
    this.productWidth = 0;
    this.productsToShow = 5;
    this.productList = [];
    this.lockPosition = 0;
  })();
  var view = new (function () {
    var _this = this;

    this.setProductElements = function () {
      model.productList = Array.prototype.slice.call(
        document.querySelectorAll(".default")
      );
    };

    this.setProductWidth = function () {
      model.containerWidth = selectors.brSwiperContainer.offsetWidth;
      model.productWidth = model.containerWidth / model.productsToShow;
      model.productList.forEach(function (product) {
        product.style.width = model.productWidth + "px";
      });
    };

    this.setStartingPosition = function () {
      _this.setProductElements();

      _this.setProductWidth();

      var centralPosition;
      var swiperPosition;

      if (model.productList.length % 2 === 0) {
        centralPosition = Math.ceil(model.productList.length / 2);
        swiperPosition = Math.ceil(
          (model.productList.length - model.productsToShow) / 2
        );
      } else {
        centralPosition = Math.floor(model.productList.length / 2);
        swiperPosition = 0;
      }

      selectors.brSwiperFocus = model.productList[centralPosition];
      selectors.brSwiperPrev = model.productList[centralPosition - 1];
      selectors.brSwiperPrev.addEventListener(
        "click",
        events.onPrevious,
        false
      );
      selectors.brSwiperNext = model.productList[centralPosition + 1];
      selectors.brSwiperNext.addEventListener("click", events.onNext, false);
      selectors.brSwiperFocus.classList.add("focus");
      selectors.brSwiperPrev.classList.add("prev");
      selectors.brSwiperNext.classList.add("next");
      selectors.brSwiperWrapper.style.left =
        "-" + model.productWidth * swiperPosition + "px";

      _this.createProductCTA(selectors.brSwiperFocus);
    };

    this.createProductCTA = function (selector) {
      var productInfo = selector.getAttribute("data-product");
      var productPrize = selector.getAttribute("data-prize");
      var productOrder = Number(selector.getAttribute("data-list")) + 1;
      var productLink = selector.querySelector("a").getAttribute("href");
      selectors.brSwiperProductInfo.innerHTML = productInfo;
      selectors.brSwiperProductPrize.innerHTML = productPrize;
      selectors.brSwiperProductCounter.innerHTML =
        "Producto <span>" +
        productOrder +
        "</span> de <span>" +
        model.productList.length +
        "</span>";
      selectors.brSwiperProductCTA.setAttribute("href", productLink);
    };

    this.cleanClassAndEvents = function () {
      selectors.brSwiperNext.removeEventListener("click", events.onNext);
      selectors.brSwiperPrev.removeEventListener("click", events.onPrevious);
      selectors.brSwiperNext.classList.remove("next");
      selectors.brSwiperPrev.classList.remove("prev");
      selectors.brSwiperFocus.classList.remove("focus");
    };

    this.swipeOne = function (direction) {
      var previousLeft = parseFloat(selectors.brSwiperWrapper.style.left);
      direction === "left" &&
        (selectors.brSwiperWrapper.style.left =
          previousLeft - model.productWidth + "px");
      direction === "right" &&
        (selectors.brSwiperWrapper.style.left =
          previousLeft + model.productWidth + "px");
    };

    this.resetClasses = function () {
      model.productList.forEach(function (product) {
        product.removeEventListener("click", events.onNext);
        product.removeEventListener("click", events.onPrevious);
        product.classList.remove("focus");
        product.classList.remove("prev");
        product.classList.remove("next");
      });
    };
  })();
  var events = new (function () {
    var _this2 = this;

    this.resizeProductAndPosition = function (e) {
      if (e.target.innerWidth < 750) {
        view.resetClasses();
        model.productsToShow = 3;
        view.setStartingPosition();
      } else if (e.target.innerWidth > 750) {
        view.resetClasses();
        model.productsToShow = 5;
        view.setStartingPosition();
      }

      var previousWidth = model.productWidth;
      var previousLeft = parseFloat(selectors.brSwiperWrapper.style.left);
      view.setProductWidth();
      var reducctionFactor = previousWidth / model.productWidth;
      selectors.brSwiperWrapper.style.left =
        previousLeft / reducctionFactor + "px";
    };

    this.onPrevious = function () {
      if (selectors.brSwiperFocus.previousElementSibling) {
        view.cleanClassAndEvents();
        selectors.brSwiperNext = selectors.brSwiperFocus;
        selectors.brSwiperNext.classList.add("next");
        selectors.brSwiperNext.addEventListener("click", events.onNext, false);
        selectors.brSwiperFocus = selectors.brSwiperPrev;
        selectors.brSwiperFocus.classList.add("focus");
        view.createProductCTA(selectors.brSwiperFocus);

        if (selectors.brSwiperPrev.previousElementSibling) {
          selectors.brSwiperPrev =
            selectors.brSwiperPrev.previousElementSibling;
          selectors.brSwiperPrev.classList.add("prev");
          selectors.brSwiperPrev.addEventListener(
            "click",
            events.onPrevious,
            false
          );
        }

        view.swipeOne("right");
      }
    };

    this.onNext = function () {
      if (selectors.brSwiperFocus.nextElementSibling) {
        view.cleanClassAndEvents();
        selectors.brSwiperPrev = selectors.brSwiperFocus;
        selectors.brSwiperPrev.classList.add("prev");
        selectors.brSwiperPrev.addEventListener(
          "click",
          events.onPrevious,
          false
        );
        selectors.brSwiperFocus = selectors.brSwiperNext;
        selectors.brSwiperFocus.classList.add("focus");
        view.createProductCTA(selectors.brSwiperFocus);

        if (selectors.brSwiperNext.nextElementSibling) {
          selectors.brSwiperNext = selectors.brSwiperNext.nextElementSibling;
          selectors.brSwiperNext.classList.add("next");
          selectors.brSwiperNext.addEventListener(
            "click",
            events.onNext,
            false
          );
        }

        view.swipeOne("left");
      }
    };

    this.lock = function (e) {
      model.lockPosition = _this2.unify(e).clientX;
    };

    this.move = function (e) {
      if (model.lockPosition > _this2.unify(e).clientX) {
        _this2.onNext();
      } else if (model.lockPosition < _this2.unify(e).clientX) {
        _this2.onPrevious();
      }
    };

    this.unify = function (e) {
      return e.changedTouches ? e.changedTouches[0] : e;
    };
  })();

  if (window.innerWidth < 750) {
    view.resetClasses();
    model.productsToShow = 3;
  }

  view.setStartingPosition();
  window.addEventListener("resize", events.resizeProductAndPosition, true);
  selectors.brSwiperWrapper.addEventListener("mousedown", events.lock, true);
  selectors.brSwiperWrapper.addEventListener("touchstart", events.lock, true);
  selectors.brSwiperWrapper.addEventListener("mouseup", events.move, true);
  selectors.brSwiperWrapper.addEventListener("touchend", events.move, true);
  selectors.brSwiperLeftButton.addEventListener(
    "click",
    events.onPrevious,
    true
  );
  selectors.brSwiperRightButton.addEventListener("click", events.onNext, true);
};

var mainIe = function mainIe() {
  var selectors = new (function () {
    this.page = document.querySelector("body");
    this.brSwiperContainer = this.page.querySelectorAll(".br-swiper-container");
    this.brSwiperWrapper = this.page.querySelectorAll(".br-swiper-wrapper");
    this.brSwiperDefault = this.page.querySelectorAll(".default");
    this.brSwiperProductInfo = this.page.querySelector(
      ".br-swipe-product-info"
    );
    this.brLeftButton = this.page.querySelector(".left-button");
    this.brRightButton = this.page.querySelector(".right-button");
  })();
  var view = new (function () {
    var _this3 = this;

    this.addIeTemplate = function () {
      selectors.brLeftButton.style.display = "none";
      selectors.brRightButton.style.display = "none";
      selectors.brSwiperProductInfo.style.display = "none";

      _this3.toggleIeClasses(
        selectors.brSwiperContainer,
        "br-swiper-container"
      );

      _this3.toggleIeClasses(selectors.brSwiperWrapper, "br-swiper-wrapper");

      _this3.toggleIeClasses(selectors.brSwiperDefault, "default");

      _this3.addProductCTA();
    };

    this.toggleIeClasses = function (selectorsNode, className) {
      var selectorsListToArray = Array.apply(null, selectorsNode);
      selectorsListToArray.forEach(function (e) {
        e.className = "";
        e.classList.add(className + "-ie");
      });
    };

    this.addProductCTA = function () {
      var productList = document.querySelectorAll(".default-ie");
      var productListToArray = Array.apply(null, productList);
      productListToArray.forEach(function (product) {
        var productContainer = product.querySelector("a");
        var button = document.createElement("button");
        var p = document.createElement("p");
        var pPrize = document.createElement("p");
        pPrize.classList.add("br-swipe-product-info-prize-ie");
        button.innerHTML = "VER YA";
        p.innerHTML = product.getAttribute("data-product");
        pPrize.innerHTML = product.getAttribute("data-prize");
        productContainer.appendChild(p);
        productContainer.appendChild(pPrize);
        productContainer.appendChild(button);
      });
    };
  })();
  view.addIeTemplate();
};

document.addEventListener("DOMContentLoaded", function (e) {
  if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    window.addEventListener("load", mainIe);
  } else window.addEventListener("load", main);
});
