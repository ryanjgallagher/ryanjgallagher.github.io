---
permalink: /publications/gallagher2017anchored
title: Anchored Correlation Explanation
subtitle: <span style="font-size:1em">Topic Modeling with Minimal Domain Knowledge</span>
description: Anchored CorEx
price: <span style="text-align:left;display:block;font-size:0.8em">Ryan J. Gallagher, Kyle Reing, David Kale, Greg Ver Steeg</span>
product_code: <span style="text-align:left;display:block;font-size:0.9em">Transactions of the Assocciation for Computational Linguistics, 2017</span>
layout: product
hide_hero: true
hide_footer: true
image: /files/imgs/publications/gallagher2017anchored.png
features:
    - label: <a href="https://www.mitpressjournals.org/doi/abs/10.1162/tacl_a_00078">Journal article (open access)</a>
      icon: fas fa-book-open
    - label: <a href="https://doi.org/10.1162/tacl_a_00078">10.1162/tacl_a_00078</a>
      icon: ai ai-doi
    - label: <a href="https://arxiv.org/abs/1611.10277">arXiv preprint (open access)</a>
      icon: ai ai-arxiv
    - label: <a href="https://github.com/gregversteeg/corex_topic">Topic modeling code</a>
      icon: fab fa-python
    - label: <a href="/files/slides/gallagher2017anchored_naccl2018.pdf">Slides</a>
      icon: far fa-file-powerpoint
---

While generative models such as Latent Dirichlet Allocation (LDA) have proven fruitful in topic modeling, they often require detailed assumptions and careful specification of hyperparameters. Such model complexity issues only compound when trying to generalize generative models to incorporate human input. We introduce Correlation Explanation (CorEx), an alternative approach to topic modeling that does not assume an underlying generative model, and instead learns maximally informative topics through an information-theoretic framework. This framework naturally generalizes to hierarchical and semi-supervised extensions with no additional modeling assumptions. In particular, word-level domain knowledge can be flexibly incorporated within CorEx through anchor words, allowing topic separability and representation to be promoted with minimal human intervention. Across a variety of datasets, metrics, and experiments, we demonstrate that CorEx produces topics that are comparable in quality to those produced by unsupervised and semi-supervised variants of LDA.
