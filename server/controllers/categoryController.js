import Category from '../models/Category.js';
import Course from '../models/Course.js';

export const getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
};

export const getCategoryCourses = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  const filter = category
    ? { category: category.name, isPublished: true }
    : { categorySlug: req.params.slug, isPublished: true };

  const courses = await Course.find(filter).sort({ rating: -1 }).limit(24);
  res.json({ category, courses });
};
