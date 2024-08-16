import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) ||10000000,
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `failed to get post` });
  }
};


export const getPost = async (req, res) => {
  try {
    // Fetch the post details
    const id = req.params.id;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            id:true,
          },
        },
      },
    });

    // If post is not found, return a 404 response
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const token = req.cookies?.token;
    
    // If no token, return post with isSaved: false
    if (!token) {
      return res.status(200).json({ ...post, isSaved: false });
    }

    // Verify token and check if post is saved by the user
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
      if (err) {
        return res.status(200).json({ ...post, isSaved: false });
      }

      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            postId: req.params.id,
            userId: payload.id,
          },
        },
      });

      return res.status(200).json({ ...post, isSaved: saved ? true : false });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get post' });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const userId = req.userId; // we got it from our middleware
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userID: userId,
        postDetail:{
            create: body.postDetail,
        }
      },
    });
  res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `failed to get post` });
  }
};

export const updatePost = async (req, res) => {
  const body = req.body;
  const pId = req.params.id;
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: pId,
      },
      data: {
        ...body,
      },
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `failed to get post` });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const userID = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) return res.status(404).json({ message: `post cant be found` });

    if (post.userID != userID) {
      res.status(500).json({ message: `could't delete the post` });
    } else {
      await prisma.post.delete({
        where: {
          id,
        },
      });
    res.status(200).send({ message: `Post deleted` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `failed to get post` });
  }
};
