import i18next from 'i18next';

export default () => ({
  t(key) {
    return i18next.t(key);
  },

  formatDate(str) {
    const date = new Date(str);

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  },

  isEmpty(value) {
    if (value == null) {
      return true;
    }

    if (typeof value !== 'object' && typeof value !== 'function') {
      return true;
    }

    if (Array.isArray(value) || typeof value === 'string'
      || (typeof value.length === 'number' && value.length > 0 && (value.length - 1) in value)) {
      return value.length === 0;
    }

    if (value instanceof Map || value instanceof Set) {
      return value.size === 0;
    }

    if (typeof value === 'object') {
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
        return value.length === 0;
      }

      const proto = Object.getPrototypeOf(value);
      if (proto === null || proto === Object.prototype) {
        return Object.keys(value).length === 0;
      }
    }

    return false;
  },

  get(obj, key, defaultValue = undefined) {
    const result = obj[key] || defaultValue;
    return result;
  },

  convertPropertyName(property) {
    const dict = {
      status: 'statusId',
      executor: 'executorId',
      labels: 'labels',
    };
    return dict[property];
  },

  getAlertClass(type) {
    switch (type) {
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
});
