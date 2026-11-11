/**
 * ==========================================================================
 * Temperature Converter Website - script.js
 * Pure Vanilla JavaScript (ES6+), Event-driven, Zero External Dependencies.
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Constants & Scientific Limits
  // ------------------------------------------------------------------------
  const ABSOLUTE_ZERO = {
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0,
  };

  // ------------------------------------------------------------------------
  // 2. DOM Elements Cache
  // ------------------------------------------------------------------------
  const form = document.getElementById('tempForm');
  const tempInput = document.getElementById('tempInput');
  const unitSelect = document.getElementById('unitSelect');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorMessage = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');

  // Results elements
  const inputEchoBadge = document.getElementById('inputEchoBadge');
  const thermalStatus = document.getElementById('thermalStatus');
  const thermalIcon = document.getElementById('thermalIcon');
  const thermalLabel = document.getElementById('thermalLabel');

  // Unit display cards
  const cards = {
    celsius: document.getElementById('cardCelsius'),
    fahrenheit: document.getElementById('cardFahrenheit'),
    kelvin: document.getElementById('cardKelvin'),
  };

  const values = {
    celsius: document.getElementById('celsiusValue'),
    fahrenheit: document.getElementById('fahrenheitValue'),
    kelvin: document.getElementById('kelvinValue'),
  };

  const badges = {
    celsius: document.getElementById('badgeCelsius'),
    fahrenheit: document.getElementById('badgeFahrenheit'),
    kelvin: document.getElementById('badgeKelvin'),
  };

  const formulas = {
    celsius: document.getElementById('celsiusFormula'),
    fahrenheit: document.getElementById('fahrenheitFormula'),
    kelvin: document.getElementById('kelvinFormula'),
  };

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');

  // Preset chips
  const presetChips = document.querySelectorAll('.preset-chip');

  // Copy buttons
  const copyButtons = document.querySelectorAll('.copy-btn');

  // ------------------------------------------------------------------------
  // 3. Mathematical Conversion Functions
  // ------------------------------------------------------------------------

  /**
   * Converts a temperature from Celsius to Fahrenheit and Kelvin.
   * @param {number} c - Temperature in Celsius
   * @returns {{celsius: number, fahrenheit: number, kelvin: number}}
   */
  function convertFromCelsius(c) {
    const fahrenheit = (c * 9) / 5 + 32;
    const kelvin = c + 273.15;
    return {
      celsius: c,
      fahrenheit: fahrenheit,
      kelvin: kelvin,
    };
  }

  /**
   * Converts a temperature from Fahrenheit to Celsius and Kelvin.
   * @param {number} f - Temperature in Fahrenheit
   * @returns {{celsius: number, fahrenheit: number, kelvin: number}}
   */
  function convertFromFahrenheit(f) {
    const celsius = ((f - 32) * 5) / 9;
    const kelvin = ((f - 32) * 5) / 9 + 273.15;
    return {
      celsius: celsius,
      fahrenheit: f,
      kelvin: kelvin,
    };
  }

  /**
   * Converts a temperature from Kelvin to Celsius and Fahrenheit.
   * @param {number} k - Temperature in Kelvin
   * @returns {{celsius: number, fahrenheit: number, kelvin: number}}
   */
  function convertFromKelvin(k) {
    const celsius = k - 273.15;
    const fahrenheit = ((k - 273.15) * 9) / 5 + 32;
    return {
      celsius: celsius,
      fahrenheit: fahrenheit,
      kelvin: k,
    };
  }

  /**
   * Dispatches conversion based on selected unit.
   * @param {number} value - Temperature value
   * @param {'celsius'|'fahrenheit'|'kelvin'} unit - Input unit
   * @returns {{celsius: number, fahrenheit: number, kelvin: number}}
   */
  function performConversion(value, unit) {
    switch (unit) {
      case 'celsius':
        return convertFromCelsius(value);
      case 'fahrenheit':
        return convertFromFahrenheit(value);
      case 'kelvin':
        return convertFromKelvin(value);
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }

  // ------------------------------------------------------------------------
  // 4. Formatting Utilities
  // ------------------------------------------------------------------------

  /**
   * Cleanly formats a floating point temperature to up to 2 decimal places,
   * avoiding floating-point precision artifacts (e.g. 0.00000000004) and -0.
   * @param {number} num - Raw number
   * @returns {string} Formatted number string
   */
  function formatTemperatureNumber(num) {
    if (Object.is(num, -0) || Math.abs(num) < 0.00001) {
      return '0';
    }
    // Round to 2 decimal places with Number.EPSILON for high precision
    const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
    // Format using standard locale formatting, up to 2 decimal places
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Determines a thermal category and icon based on temperature in Celsius.
   * @param {number} c - Celsius value
   * @returns {{icon: string, text: string}}
   */
  function getThermalCategory(c) {
    if (c <= -273.15) {
      return { icon: '🧊', text: 'Absolute Zero Limit' };
    }
    if (c < 0) {
      return { icon: '❄️', text: 'Freezing / Sub-Zero' };
    }
    if (c === 0) {
      return { icon: '💧', text: 'Freezing Point of Water' };
    }
    if (c > 0 && c < 15) {
      return { icon: '🧥', text: 'Chilly / Cold' };
    }
    if (c >= 15 && c < 26) {
      return { icon: '🌤️', text: 'Room / Comfortable' };
    }
    if (c >= 26 && c < 36) {
      return { icon: '☀️', text: 'Warm' };
    }
    if (c >= 36 && c <= 38) {
      return { icon: '🌡️', text: 'Human Body Temperature' };
    }
    if (c > 38 && c < 100) {
      return { icon: '♨️', text: 'Very Hot' };
    }
    if (c === 100) {
      return { icon: '💨', text: 'Boiling Point of Water' };
    }
    return { icon: '🔥', text: 'Extreme Heat' };
  }

  // ------------------------------------------------------------------------
  // 5. Validation Function
  // ------------------------------------------------------------------------

  /**
   * Validates the raw input string against empty, non-numeric, and absolute zero rules.
   * @param {string} rawInput - Text from input field
   * @param {'celsius'|'fahrenheit'|'kelvin'} unit - Chosen unit
   * @returns {{isValid: boolean, error?: string, numericValue?: number}}
   */
  function validateInput(rawInput, unit) {
    const trimmed = rawInput.trim();

    // Check 1: Empty input
    if (trimmed === '') {
      return {
        isValid: false,
        error: 'Please enter a temperature value.',
      };
    }

    // Check 2: Valid numeric format (handles negative signs and decimals)
    // Regex allows: e.g. "25", "-25", "25.5", "-0.75", "+30", ".5", "-.5"
    const numericRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
    if (!numericRegex.test(trimmed)) {
      return {
        isValid: false,
        error: 'Please enter a valid numeric temperature (e.g., 25, -10.5). Text, symbols, or multiple decimals are not allowed.',
      };
    }

    const numericValue = Number(trimmed);
    if (Number.isNaN(numericValue)) {
      return {
        isValid: false,
        error: 'The entered value is not a valid number. Please check your input.',
      };
    }

    // Check 3: Absolute-zero physical boundary validation
    if (unit === 'celsius' && numericValue < ABSOLUTE_ZERO.celsius) {
      return {
        isValid: false,
        error: `Temperature cannot be below Absolute Zero (-273.15 °C). This is the physical limit where all molecular motion ceases.`,
      };
    }

    if (unit === 'fahrenheit' && numericValue < ABSOLUTE_ZERO.fahrenheit) {
      return {
        isValid: false,
        error: `Temperature cannot be below Absolute Zero (-459.67 °F). Nothing in the universe can be colder than absolute zero.`,
      };
    }

    if (unit === 'kelvin' && numericValue < ABSOLUTE_ZERO.kelvin) {
      return {
        isValid: false,
        error: `Temperature cannot be below Absolute Zero (0 K). The Kelvin scale starts at 0 and cannot be negative.`,
      };
    }

    return {
      isValid: true,
      numericValue: numericValue,
    };
  }

  // ------------------------------------------------------------------------
  // 6. UI Update Functions
  // ------------------------------------------------------------------------

  /**
   * Displays an error message and highlights the input box.
   * @param {string} message - Validation error description
   */
  function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    tempInput.classList.add('is-invalid');
    tempInput.setAttribute('aria-invalid', 'true');
    // Re-trigger shake animation
    errorMessage.style.animation = 'none';
    // Force DOM reflow
    void errorMessage.offsetHeight;
    errorMessage.style.animation = '';
  }

  /**
   * Clears the error banner and restores normal input style.
   */
  function clearError() {
    errorMessage.classList.add('hidden');
    errorText.textContent = '';
    tempInput.classList.remove('is-invalid');
    tempInput.removeAttribute('aria-invalid');
  }

  /**
   * Updates the UI cards with the conversion results.
   * @param {{celsius: number, fahrenheit: number, kelvin: number}} results
   * @param {'celsius'|'fahrenheit'|'kelvin'} inputUnit
   * @param {number} inputValue
   */
  function displayResults(results, inputUnit, inputValue) {
    clearError();

    // Formatted values
    const formattedC = formatTemperatureNumber(results.celsius);
    const formattedF = formatTemperatureNumber(results.fahrenheit);
    const formattedK = formatTemperatureNumber(results.kelvin);

    values.celsius.textContent = formattedC;
    values.fahrenheit.textContent = formattedF;
    values.kelvin.textContent = formattedK;

    // Highlight the card that represents the input source unit
    const unitKeys = ['celsius', 'fahrenheit', 'kelvin'];
    unitKeys.forEach((key) => {
      const isSource = key === inputUnit;
      if (isSource) {
        cards[key].classList.add('is-source-unit');
        badges[key].textContent = 'Input Unit';
        badges[key].classList.add('is-source');
      } else {
        cards[key].classList.remove('is-source-unit');
        badges[key].textContent = 'Converted';
        badges[key].classList.remove('is-source');
      }
    });

    // Update dynamic formula explanation strings on each card
    const formattedInput = formatTemperatureNumber(inputValue);
    if (inputUnit === 'celsius') {
      formulas.celsius.textContent = 'Original input value';
      formulas.fahrenheit.textContent = `(${formattedInput} × 9/5) + 32 = ${formattedF} °F`;
      formulas.kelvin.textContent = `${formattedInput} + 273.15 = ${formattedK} K`;
    } else if (inputUnit === 'fahrenheit') {
      formulas.celsius.textContent = `(${formattedInput} - 32) × 5/9 = ${formattedC} °C`;
      formulas.fahrenheit.textContent = 'Original input value';
      formulas.kelvin.textContent = `(${formattedInput} - 32) × 5/9 + 273.15 = ${formattedK} K`;
    } else {
      formulas.celsius.textContent = `${formattedInput} - 273.15 = ${formattedC} °C`;
      formulas.fahrenheit.textContent = `(${formattedInput} - 273.15) × 9/5 + 32 = ${formattedF} °F`;
      formulas.kelvin.textContent = 'Original input value';
    }

    // Update the echo badge in header
    const unitSymbols = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
    inputEchoBadge.textContent = `Converted from ${formattedInput} ${unitSymbols[inputUnit]}`;

    // Update thermal status tag
    const thermal = getThermalCategory(results.celsius);
    thermalIcon.textContent = thermal.icon;
    thermalLabel.textContent = thermal.text;
    thermalStatus.classList.remove('hidden');
  }

  /**
   * Resets the entire calculator to initial blank state.
   */
  function handleReset() {
    form.reset();
    clearError();
    clearInputBtn.classList.add('hidden');

    // Reset result values
    values.celsius.textContent = '--';
    values.fahrenheit.textContent = '--';
    values.kelvin.textContent = '--';

    // Reset badges and formulas
    ['celsius', 'fahrenheit', 'kelvin'].forEach((key) => {
      cards[key].classList.remove('is-source-unit');
      badges[key].textContent = 'Output';
      badges[key].classList.remove('is-source');
      formulas[key].textContent = 'Formula reference';
    });

    inputEchoBadge.textContent = 'Awaiting calculation';
    thermalStatus.classList.add('hidden');
    tempInput.focus();
  }

  /**
   * Main calculation handler triggered by form submission or preset click.
   */
  function handleCalculation() {
    const rawInput = tempInput.value;
    const unit = unitSelect.value;

    const validation = validateInput(rawInput, unit);
    if (!validation.isValid) {
      showError(validation.error);
      return;
    }

    const results = performConversion(validation.numericValue, unit);
    displayResults(results, unit, validation.numericValue);
  }

  // ------------------------------------------------------------------------
  // 7. Event Listeners Setup
  // ------------------------------------------------------------------------

  // Form submit handler (triggers on Convert button click or Enter key press)
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleCalculation();
  });

  // Reset button handler
  resetBtn.addEventListener('click', () => {
    handleReset();
  });

  // Input change/keystroke handler: clears validation errors and toggles clear button
  tempInput.addEventListener('input', () => {
    if (errorMessage && !errorMessage.classList.contains('hidden')) {
      clearError();
    }
    if (tempInput.value.length > 0) {
      clearInputBtn.classList.remove('hidden');
    } else {
      clearInputBtn.classList.add('hidden');
    }
  });

  // Clear button inside input box
  clearInputBtn.addEventListener('click', () => {
    tempInput.value = '';
    clearInputBtn.classList.add('hidden');
    clearError();
    tempInput.focus();
  });

  // Unit dropdown change: auto-recalculate if valid input is already present
  unitSelect.addEventListener('change', () => {
    if (tempInput.value.trim() !== '') {
      handleCalculation();
    }
  });

  // Quick Preset Chips click handler
  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const presetTemp = chip.getAttribute('data-temp');
      const presetUnit = chip.getAttribute('data-unit') || 'celsius';

      tempInput.value = presetTemp;
      unitSelect.value = presetUnit;
      clearInputBtn.classList.remove('hidden');
      clearError();
      handleCalculation();
    });
  });

  // Copy result to clipboard handler
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const valueText = targetElement.textContent.trim();
      if (valueText === '--' || valueText === '') return;

      // Determine unit suffix
      let suffix = '';
      if (targetId === 'celsiusValue') suffix = ' °C';
      else if (targetId === 'fahrenheitValue') suffix = ' °F';
      else if (targetId === 'kelvinValue') suffix = ' K';

      const fullText = `${valueText}${suffix}`;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(fullText);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = fullText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        btn.classList.add('copied');
        setTimeout(() => {
          btn.classList.remove('copied');
        }, 1600);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 8. Theme Toggle (Light / Dark Mode)
  // ------------------------------------------------------------------------

  /**
   * Applies the theme to documentElement and saves choice to localStorage.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIconSun.classList.remove('hidden');
      themeIconMoon.classList.add('hidden');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIconSun.classList.add('hidden');
      themeIconMoon.classList.remove('hidden');
    }
    try {
      localStorage.setItem('tempConverterTheme', theme);
    } catch (e) {
      // Ignore if localStorage is disabled
    }
  }

  // Detect saved preference or system preference
  const savedTheme = (() => {
    try {
      return localStorage.getItem('tempConverterTheme');
    } catch (e) {
      return null;
    }
  })();

  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
});
