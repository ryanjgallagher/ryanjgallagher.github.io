---
title: "Anchored Correlation Explanation: Topic Modeling with Minimal Domain Knowledge"
authors:
  - Ryan J. Gallagher
  - Kyle Reing
  - David Kale
  - Greg Ver Steeg
venue: Transactions of the Association for Computational Linguistics
year: 2017
type: journal
peerReviewed: true
categories:
  - Natural Language Processing
scholarId: u-x6o8ySG0sC
doi: 10.1162/tacl_a_00078
volume: "5"
pages: "529-542"
image: ./images/gallagher2017anchored.png
imageAlt: Figure from "Anchored Correlation Explanation"
links:
  - type: article
    url: https://www.mitpressjournals.org/doi/abs/10.1162/tacl_a_00078
    openAccess: true
  - type: arxiv
    url: https://arxiv.org/abs/1611.10277
    openAccess: true
  - type: code
    url: https://github.com/gregversteeg/corex_topic
  - type: slides
    url: /files/slides/gallagher2017anchored_naccl2018.pdf
    label: Slides
---

While generative models such as Latent Dirichlet Allocation (LDA) have proven fruitful in topic modeling, they often require detailed assumptions and careful specification of hyperparameters. Such model complexity issues only compound when trying to generalize generative models to incorporate human input. We introduce Correlation Explanation (CorEx), an alternative approach to topic modeling that does not assume an underlying generative model, and instead learns maximally informative topics through an information-theoretic framework. This framework naturally generalizes to hierarchical and semi-supervised extensions with no additional modeling assumptions. In particular, word-level domain knowledge can be flexibly incorporated within CorEx through anchor words, allowing topic separability and representation to be promoted with minimal human intervention. Across a variety of datasets, metrics, and experiments, we demonstrate that CorEx produces topics that are comparable in quality to those produced by unsupervised and semi-supervised variants of LDA.
