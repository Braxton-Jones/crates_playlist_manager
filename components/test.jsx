// 'use client'
// import { useRouter } from 'next/navigation';

// const MyComponent = () => {
//   const router = useRouter();

//   const addSearchParam = (key, value) => {
//     router.push({
//       pathname: router.pathname,
//       query: { ...router.query, [key]: value }
//     }, undefined, { shallow: true });
//   };

//   const removeSearchParam = (key) => {
//     const { [key]: _, ...rest } = router.query;
//     router.push({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
//   };

//   return (
//     <>
//       <button onClick={() => addSearchParam('search', 'myValue')}>
//         Add Search Param
//       </button>
//       <button onClick={() => removeSearchParam('search')}>
//         Remove Search Param
//       </button>
//     </>
//   );
// };

export default MyComponent
