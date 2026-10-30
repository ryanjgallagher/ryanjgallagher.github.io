---
title: "Generalized Word Shift Graphs: A Method for Visualizing and Explaining Pairwise Comparisons Between Texts"
authors:
  - Ryan J. Gallagher
  - Morgan R. Frank
  - Lewis Mitchell
  - Aaron J. Schwartz
  - Andrew J. Reagan
  - Christopher M. Danforth
  - Peter Sheridan Dodds
venue: EPJ Data Science
year: 2021
type: journal
peerReviewed: true
categories:
  - Natural Language Processing
  - Data Visualization
scholarId: qjMakFHDy7sC
doi: 10.1140/epjds/s13688-021-00260-3
volume: "10"
issue: "1"
pages: "4"
publisher: Springer
image: ./images/gallagher2021generalized.png
imageAlt: Figure from "Generalized Word Shift Graphs"
links:
  - type: article
    url: https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-021-00260-3
    openAccess: true
  - type: arxiv
    url: https://arxiv.org/abs/2008.02250
    openAccess: true
  - type: code
    url: https://github.com/ryanjgallagher/wordlevel
  - type: slides
    url: /files/slides/gallagher2020generalized_uvm.pdf
    label: Slides
---

A common task in computational text analyses is to quantify how two corpora differ according to a measurement like word frequency, sentiment, or information content. However, collapsing the texts' rich stories into a single number is often conceptually perilous, and it is difficult to confidently interpret interesting or unexpected textual patterns without looming concerns about data artifacts or measurement validity. To better capture fine-grained differences between texts, we introduce generalized word shift graphs, visualizations which yield a meaningful and interpretable summary of how individual words contribute to the variation between two texts for any measure that can be formulated as a weighted average. We show that this framework naturally encompasses many of the most commonly used approaches for comparing texts, including relative frequencies, dictionary scores, and entropy-based measures like the Kullback-Leibler and Jensen-Shannon divergences. Through several case studies, we demonstrate how generalized word shift graphs can be flexibly applied across domains for diagnostic investigation, hypothesis generation, and substantive interpretation. By providing a detailed lens into textual shifts between corpora, generalized word shift graphs help computational social scientists, digital humanists, and other text analysis practitioners fashion more robust scientific narratives.
