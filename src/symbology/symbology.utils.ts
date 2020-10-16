import Feature from 'ol/feature';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import RenderFeature from 'ol/render/Feature';

// http://stackoverflow.com/questions/14484787/wrap-text-in-javascript
export default function stringDivider(str: string, width: number, spaceReplacer: string): string {
  if (str.length > width) {
    let p = width;
    while (p > 0 && str[p] !== ' ' && str[p] !== '-') {
      p--;
    }
    if (p > 0) {
      let left;
      if (str.substring(p, p + 1) === '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      const right = str.substring(p + 1);
      return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
    }
  }
  return str;
}

export function createLabelFromFeature(feature: Feature | RenderFeature): Text {
  const feature2 = feature as Feature;
  let text: string;
  if (feature2.get('label')) {
    text = stringDivider(feature2.get('label') as string, 20, '\n');
  } else {
    text = stringDivider(feature2.getId() as string, 20, '\n');
  }
  return new Text({
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.5)',
    }),
    text,
    fill: new Fill({
      color: '#fff',
    }),
    font: '14px Roboto',
    padding: [4, 4, 4, 4],
  });
}
