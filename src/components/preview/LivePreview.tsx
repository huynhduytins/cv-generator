import { useCvStore } from "@/store/cv-store";
import { selectPreviewViewModel } from "@/store/selectors/preview-selectors";

import MinimalistTemplate from "../templates/minimalist/MinimalistTemplate";
import styles from "./LivePreview.module.css";

const LivePreview = () => {
  const previewModel = useCvStore(selectPreviewViewModel);
  const contactDisplayMode = useCvStore((state) => state.contactDisplayMode);
  const setContactDisplayMode = useCvStore((state) => state.setContactDisplayMode);

  return (
    <section className={styles.root} aria-label="Live CV preview">
      <div className={styles.toolbar}>
        <p className={styles.meta}>Live Preview (Minimalist)</p>
        <div className={styles.switchGroup} role="group" aria-label="Contact display mode">
          <button
            type="button"
            className={styles.switchButton}
            data-active={contactDisplayMode === "label"}
            onClick={() => setContactDisplayMode("label")}
          >
            Label
          </button>
          <button
            type="button"
            className={styles.switchButton}
            data-active={contactDisplayMode === "icon"}
            onClick={() => setContactDisplayMode("icon")}
          >
            Icon
          </button>
        </div>
      </div>
      <MinimalistTemplate viewModel={previewModel} contactDisplayMode={contactDisplayMode} />
    </section>
  );
};

export default LivePreview;
