export function convertObjectToFormData (object) {
  const objectKeys = Object.keys(object)
  const stringArray = []
  objectKeys.forEach((key) => {
    stringArray.push(`${key}=${object[key]}`)
  })
  const formString = stringArray.join('&') 
  return formString
}

export function convertObjectToMultiFormData (object, files, type) {
  const formData = new FormData();
  const objectKeys = Object.keys(object)
  objectKeys.forEach((key) => {
    formData.append(key, object[key])
  })
  if (type === 'file') {
    files.forEach((file) => {
      formData.append('file_name', file.name )
      formData.append('object_file', file)
    })
  } else if (type === 'folder') {
    formData.append('folder_name', files[0].name)
    files.forEach((file, key) => {
      formData.append(`file[${key}].path`, file.webkitRelativePath )
      formData.append(`file[${key}]`, file)
    })
  }
  return formData
}

