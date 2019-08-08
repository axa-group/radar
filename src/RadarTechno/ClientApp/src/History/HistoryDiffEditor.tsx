import { Loader } from '@axa-fr/react-toolkit-all';
import React, { Suspense } from 'react';

export const HistoryDiffEditor = ({diff}: {diff: string}) => {
  
  const MonacoDiffEditor = React.lazy(() => import('./MonacoEditor'));

  const left = {};
  const right = {};
  const diffObject = JSON.parse(diff);
  Object.keys(diffObject).forEach(key => {
    if(diffObject[key].length === 1) {
      right[key] = diffObject[key][0];
    } else {
      left[key] = diffObject[key][0];
      right[key] = diffObject[key][1];
    }
  });

  return (
    <Suspense fallback={<Loader mode="get" text="Loading..."/>}>
      <MonacoDiffEditor
        height="250"
        language="json"
        original={JSON.stringify(left, null, '\t')}
        value={JSON.stringify(right, null, '\t')}
        options={{
          readOnly: true,
          scrollBeyondLastLine: false
        }}
      />
    </Suspense>
  );
};
