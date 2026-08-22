import styles from "./TemplatePrimitives.module.css";

interface TagListProps {
  tags: string[];
}

const TagList = ({ tags }: TagListProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className={styles.tag}>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagList;
