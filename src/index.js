import React, { Component, PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import Icon from 'fe-icon'
import * as icons from './icons'
import styles from './index.styl'

import Dropzone from 'react-dropzone'
import Spinner from 'fe-spinner'

const basicStyle = {
  width: '100px',
  height: '100px',
  border: '2px dashed rgba(0, 0, 0, .2)',
  borderRadius: '3px'
}

@CSSModules(styles)

export default class extends Component {
  static propTypes = {
    url: PropTypes.string,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    // file: PropTypes.object,
    preview: PropTypes.string,
    type: PropTypes.oneOf(['image', 'video'])
  }
  static defaultProps = {
    url: 'http://172.30.11.75:41001/attachment',
    disableClick: false,
    multiple: false,
    accept: 'image/*',
    type: 'image'
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.preview !== this.props.preview) {
      this.setState({preview: nextprops.preview, status: nextprops.preview ? 2 : this.state.status})
    }
  }
  handleDrop = files => {
    if (!files || !files[0]) return
    this.setState(Object.assign({}, this.state, {
      files: files,
      preview: undefined
    }), () => this.upload(files[0]))
  }
  upload = (file) => {
    this.setState(Object.assign({}, this.state, {
      status: 1
    }))
    let formData = new window.FormData()
    formData.append('file', file)
    fetch(this.props.url, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        this.setState(Object.assign({}, this.state, {
          status: 2
        }))
        this.props.onSuccess && this.props.onSuccess(res)
      })
      .catch(err => this.props.onError && this.props.onError(err))
  }
  handleClear = e => {
    e.stopPropagation()
    this.props.onClear()
    this.setState({files: [], status: 0})
  }
  state = {
    files: this.props.file ? [this.props.file] : [],
    // 1 => uploading
    // 2 => uploaded
    status: this.props.preview ? 2 : 0,
    preview: this.props.preview
  }
  render () {
    const state = this.state
    const props = this.props

    let picUrl = this.state.preview || (state.files[0] ? state.files[0].preview : undefined)
    return <div styleName='wrap'>
      <Dropzone styleName='dropzone' disableClick={props.disableClick} multiple={props.multiple} accept={props.accept} style={basicStyle} onDrop={this.handleDrop}>
        {
          picUrl
          ? <div styleName='preview'>
            {
              state.status
              ? <div styleName='mask'>
                {
                  state.status === 1 ? <Spinner /> : <Icon style={{color: '#41BC6A'}} size={30} icon={icons.check} />
                }
              </div>
              : null
            }
            <span styleName='clear' onClick={this.handleClear}>&times;</span>
            {
              this.props.type !== 'video'
              ? <img src={picUrl} />
              : <video><source src={state.files[0].preview} /></video>
            }
            {
              this.props.type === 'video' ? <span styleName='videoTitle'>{state.files[0].name}</span> : null
            }
          </div>
          : <Icon size={40} icon={icons.add} />
        }
      </Dropzone>
    </div>
  }
}
