import React from 'react'

import {
  storiesOf
  // action
} from '@kadira/storybook'
import Upload from '../src/'

storiesOf('Table', module)
  .add('上传', () => (
    <div>
      <Upload onSuccess={(e) => {console.log(e)}} />
    </div>
  ))
  .add('预览', () => (
    <div>
      <Upload preview={'http://storage.lianjia.com/cp-test-image/bd55234b-4c8d-43b4-aa80-358bcd150eb6'} />
    </div>
  ))
  .add('禁用', () => (
    <div>
      <Upload disableClick/>
    </div>
  ))
