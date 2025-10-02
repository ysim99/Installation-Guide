    // Elements
    const searchInput = document.getElementById('searchInput');
    const mainContent = document.getElementById('main-content');
    const searchResults = document.getElementById('searchResults');
    const searchForm = document.querySelector('.search-form');

    window.addEventListener('scroll', () => {
        if (document.activeElement === searchInput) {
        searchInput.blur();
        }
    });

    // Blur effect on search focused
    searchInput.addEventListener('focus', () => {
      mainContent.classList.add('blur');
    });

    searchInput.addEventListener('blur', () => {
      mainContent.classList.remove('blur');
    });

    // Expand search bar on focus
        searchInput.addEventListener('focus', () => {
        searchForm.style.width = '60vw';
        searchResults.style.width = '60vw';
    });

    searchInput.addEventListener('blur', () => {
        searchForm.style.width = '40vw';
        searchResults.style.width = '40vw';
    });

//-------------------------------Typing Animation
class TextAnimator {
    constructor({
        element,
        loopTexts = [],
        constantText = '',
        typingSpeed = 100,
        deletingSpeed = 60,
        pauseInterval = 600,
    }) {
        this.element = element;
        this.loopTexts = loopTexts;
        this.constantText = constantText;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseInterval = pauseInterval;

        this.loopIndex = 0;
        this.letterIndex = 0;
        this.isDeleting = false;
        this.isLoopActive = false;
        this.animationTimeout = null;
    }

    _setText(text) {
        this.element.textContent = text || '\u00A0';
    }

    _clearTimeout() {
        clearTimeout(this.animationTimeout);
    }

    animateText(text, onComplete) {
        this._clearTimeout();
        this.isDeleting = false;
        this.letterIndex = 0;

        const step = () => {
            if (this.isDeleting) {
                this.letterIndex--;
                this._setText(text.substring(0, this.letterIndex));
                if (this.letterIndex === 0) {
                    this.isDeleting = false;
                    if (onComplete) onComplete();
                    return;
                }
            } else {
                this.letterIndex++;
                this._setText(text.substring(0, this.letterIndex));
                if (this.letterIndex === text.length) {
                    this.isDeleting = true;
                    this.animationTimeout = setTimeout(step, this.pauseInterval);
                    return;
                }
            }

            this.animationTimeout = setTimeout(
                step,
                this.isDeleting ? this.deletingSpeed : this.typingSpeed
            );
        };

        step();
    }

    _loopAnimateStep() {
        if (!this.isLoopActive) return;

        const fullText = this.loopTexts[this.loopIndex];
        if (this.isDeleting) {
            this.letterIndex--;
            this._setText(fullText.substring(0, this.letterIndex));
            if (this.letterIndex === 0) {
                this.isDeleting = false;
                this.loopIndex = (this.loopIndex + 1) % this.loopTexts.length;
                this.animationTimeout = setTimeout(() => this._loopAnimateStep(), 200);
                return;
            }
        } else {
            this.letterIndex++;
            this._setText(fullText.substring(0, this.letterIndex));
            if (this.letterIndex === fullText.length) {
                this.isDeleting = true;
                this.animationTimeout = setTimeout(() => this._loopAnimateStep(), this.pauseInterval);
                return;
            }
        }

        this.animationTimeout = setTimeout(
            () => this._loopAnimateStep(),
            this.isDeleting ? this.deletingSpeed : this.typingSpeed
        );
    }


    startLoop() {
        this._clearTimeout();
      
        if (this.isLoopActive) return;
        if (!this.loopTexts || this.loopTexts.length === 0) return;

        // Reset loop counters so animation always starts fresh.
        this.loopIndex = 0;
        this.letterIndex = 0;
        this.isDeleting = false;
        this.isLoopActive = true;

        setTimeout(() => {
        this._clearTimeout();
        this._loopAnimateStep();
        }, 8);
    }

    stopLoop() {
        this.isLoopActive = false;
        this._clearTimeout();

        this.loopIndex = 0;
        this.letterIndex = 0;
        this.isDeleting = false;

        this._setText(this.constantText);
    }
}

// ------------------------------Typing Animation Implementation

const dynamicText = document.getElementById("dynamic-text");
const animator = new TextAnimator({
  element: dynamicText,
  loopTexts: [
    "Find Your Device",
    "iPhone 17 Pro Max",
    "17 Pro Max",
    "S25 Ultra",
    "Galaxy S25 Ultra",
    "Z Flip 7",
    "Pixel 10 Pro XL",
    "OnePlus 13",
  ],
  constantText: "Looking for Your Device?",
  typingSpeed: 100,
  deletingSpeed: 60,
  pauseInterval: 600
});

// Focus / Blur
searchInput.addEventListener("focus", () => {
  animator.startLoop();
  searchResults.classList.remove('hidden');
  searchInput.classList.add('bd-gr');
  searchResults.classList.add('bd-gr');
});

searchInput.addEventListener("blur", () => {
  animator.stopLoop();
  searchResults.classList.add('hidden');
  searchInput.classList.remove('bd-gr');
  searchResults.classList.remove('bd-gr');
});


// ----------------------------------------------Data Setup
const productColumns = document.querySelectorAll('.grid-container .column');
// Build a dataset from existing HTML columns
  const productData = Array.from(productColumns).map(column => {
    return {
      element: column,
      img: column.querySelector('img')?.src,
      title: column.querySelector('h6')?.innerText.trim(),
      link: column.querySelector('a')?.href,
      device: column.dataset.device?.toLowerCase() || '',
    };
  });

  // Handle search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = ''; // Clear old results

    if (!query) return;

    const matched = productData.filter(item =>
      item.device.includes(query)
    );

    if (matched.length === 0) {
      searchResults.innerHTML = ''; // No match, show nothing
      return;
    }

    // Render matching results
    matched.forEach(item => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'search-results-contents';

      resultDiv.innerHTML = `
            <div class="img-container">
                <a href="${item.link}" target="_blank">
                    <img src="${item.img}" alt="Search Result Image">
                </a>
            </div>
            <div class="text-center search-title">
                <h4>${item.title}</h4>
            </div>
      `;

      searchResults.appendChild(resultDiv);
    });
  });

  searchResults.style.setProperty("--items", matched.length);