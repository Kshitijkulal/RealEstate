import './list.scss';
import Card from '../card/Card';

function List({ posts }) {
  // Check if posts is null or undefined
  if (!posts || posts.length === 0) {
    return <div className='list'>No posts available</div>; // Or any loading indicator or message
  }

  return (
    <div className='list'>
      {posts.map(item => (
        // Ensure item is not null or undefined before rendering
        item && <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;

