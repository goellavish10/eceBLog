const moment = require('moment')

module.exports = {
  formatDate: (date, format)=>{
    return moment(date).utcOffset("+05:30").format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  /*
  editComment: function (loggedUser, commentorName, floating = true) {
    if (loggedUser.toString() === commentorName.toString()) {
      if (floating) {
        return `<a href="/stories/edit/" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  */
  deleteComment: function (loggedUser, commentorName, id, comment, floating = true) {
    if (loggedUser.toString() === commentorName.toString()) {
      if (floating) {
        
        return `<form action="/stories/${id}/${commentorName}/${comment}" method="POST">
                    <button type="submit" class="btn red">
                        <i class="fas fa-trash fa-small"></i>
                    </button>
                </form>`
      } else {
        return `<form action="/stories/${id}/${commentorName}/${comment}" method="POST">
                    <button type="submit" class="btn red">
                        <i class="fas fa-trash"></i>
                    </button>
                </form>`
      }
    } else {
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
  
}
