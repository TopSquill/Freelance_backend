const showError = (err) => {
  if (Array.isArray(err.errors)) {
    return err.errors.map(error => error.message).join(', ');
  }

  return err.message;
}

exports.showError = showError