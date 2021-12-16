<?php

/**
 * @file
 * Civic navigation card paragraph component.
 */

use Drupal\Component\Utility\UrlHelper;

/**
 * Implements template_preprocess_paragraph().
 *
 * @SuppressWarnings(PHPMD)
 */
function civic_preprocess_paragraph__civic_card_navigation(&$variables) {
  /** @var \Drupal\paragraphs\Entity\Paragraph $paragraph */
  $paragraph = $variables['paragraph'];
  $link = ($paragraph->hasField('field_c_p_link') && !$paragraph->get('field_c_p_link')->isEmpty()) ? $paragraph->get('field_c_p_link')->first()->getValue() : [];
  $variables['url'] = $link['uri'] ?? NULL;
  $variables['is_external'] = (isset($link['uri']) && !empty($link['uri'])) ? UrlHelper::isExternal($link['uri']) : FALSE;
}