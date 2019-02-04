import React from 'react';

import Markdown from 'wix-storybook-utils/Markdown';

import Introduction from './Introduction.md';
import FAQ from './FAQ.md';
import Roadmap from './Roadmap.md';
import IntroductionAnimatedExample from './IntroductionAnimatedExample';
import { linkTo } from '@storybook/addon-links';
import TextButton from 'wix-style-react/TextButton';

export default () => (
  <div>
    <Markdown source={Introduction} />
    <IntroductionAnimatedExample />
    <TextButton onClick={linkTo('WIP/Drag And Drop/SortableList', 'API')}>
      {`<SortableList/>`} Docs
    </TextButton>
    <Markdown source={FAQ} />
    <Markdown source={Roadmap} />
  </div>
);
