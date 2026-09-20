const Tag = require(" .. /models/tags");

//create Tag ka handler funciton

exports.createTag = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            })
        }


        //create entry in DB
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });

        console.log(tagDetails);
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        })
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

exports.showAlltags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "all tags fetched successfully",
            allTags,
        })
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};