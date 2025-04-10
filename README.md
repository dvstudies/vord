<h1>VORD – New Methods for Accessing Visual Open Research Data in the Digital Humanities</h1>
<h3>About this Project</h3>
VORD proposes a novel approach to annotation and query of large art historical datasets art history. Using state-of-the-art AI models instead of hierarchical metadata, VORD establishes a more flexible and nuanced method through a modular pipeline for the computational analysis of images. VORD aims to develop methods that go beyond the usual applications of image clustering and similarity applications in digital art history. It develops a more fine-grained approach that uses multimodal foundation models (CLiP) on whole images and their relevant parts, by masking images with semantic segmentation (HIPIE). Then, the CLiP embeddings of these segments are decomposed into linear combinations of interpretable semantic concepts.

<h3>Scientific Summary</h3>
Dealing with predominantly figural representations, VORD proposes to shift the focus of AI-based art historical analysis from whole-image analytics to granular object-based studies. Powerful image segmentation models such as Meta’s SAM allow for analyzing figurative art at scale through semantic objects. VORD then extracts masks that isolate represented persons and objects as single visual entities. VORD uses HIPIE, a universal, open-vocabulary image segmentation tool. First, it extracts the masks using general terms referring to persons and objects. Since more specific labels for art historical analysis are yet missing in generic segmentation models, VORD instead leverages CLIP embeddings to allow queries through open vocabularies of discipline-specific terms, such as the Getty Index or Iconclass. Moreover, VORD extracts semantic concept embeddings from these terms using linear combinations of concepts such as in the CONCEPTOR and SpLiCe models. This allows the identification of stable pivotal concepts that enhance querying, concept quality control, and the explainability of the models.

<h3>Challenges and Goals</h3>
Due to both the specificity and polysemy of represented persons and objects, the different stylistic features of works of art compared to ‘real world’ photographs, and the lack of annotated art historical data, input-based (text or class) segmentation models are not viable. VORD, thus, shifts the perspective: instead of using object names to extract segments, it first extracts all coherent masks and successively annotates these masks by using embedding representations.

<h3>Results and Output</h3>
VORD aims at the development of a quantitatively augmented dataset accessible through its website. Such a structured dataset contains the initial visual information linked with the computational features extracted.

<h3>Impact on Open Science Practices</h3>
An interface makes the project’s results and the documentation, including the pipeline and augmented database, publicly accessible, allowing to download and visualize results interactively. The website will engage the research community by providing access to augmented and curated datasets.

<br><br>
more info at https://dvstudies.net/2023/09/08/new-methods-for-accessing-visual-open-research-data-in-the-digital-humanities/
