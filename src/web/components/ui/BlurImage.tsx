// import { Blurhash } from 'react-blurhash';
// import { useState } from 'react';

// //TODO: do poprawy - nie działa
// export function BlurImage({ src, blurhash }: { src: string, blurhash: string}) {
//   const [loaded, setLoaded] = useState(false);
//   console.log(loaded);
//   return (
//     <div style={{ position: 'relative' }}>
//       {!loaded && (
//         <Blurhash
//           hash={blurhash}
//           resolutionX={32}
//           resolutionY={32}
//           punch={1}
//         />
//       )}
//       <img
//         src={src}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           objectFit: 'cover',
//           opacity: loaded ? 1 : 0,
//           transition: 'opacity 0.3s ease',
//         }}
//         onLoad={() => setLoaded(true)}
//       />
//     </div>
//   );
// }