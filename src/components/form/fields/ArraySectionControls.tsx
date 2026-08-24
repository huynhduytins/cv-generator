import styles from "./FieldControls.module.css";

interface ArraySectionControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  moveUpLabel?: string;
  moveDownLabel?: string;
  removeLabel?: string;
}

const ArraySectionControls = ({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  moveUpLabel = "Move up",
  moveDownLabel = "Move down",
  removeLabel = "Remove",
}: ArraySectionControlsProps) => {
  return (
    <div className={styles.arrayControls}>
      <button
        type="button"
        className={styles.arrayButton}
        onClick={onMoveUp}
        disabled={!canMoveUp}
      >
        {moveUpLabel}
      </button>
      <button
        type="button"
        className={styles.arrayButton}
        onClick={onMoveDown}
        disabled={!canMoveDown}
      >
        {moveDownLabel}
      </button>
      <button type="button" className={styles.arrayButton} onClick={onRemove}>
        {removeLabel}
      </button>
    </div>
  );
};

export default ArraySectionControls;
