import { GameInfo } from '#api/db/models/GameInfo';
import { Router } from 'express';

const sortedGameInfo = Router();

export async function getSortedGameInfo(sidebarTags: string[]) {
  return GameInfo.aggregate([
    {
      $match: {
        'genres.description': { $in: sidebarTags },
      },
    },
    {
      $addFields: {
        // Get the highest priority match (earliest in sidebarTags)
        priorityOrder: {
          $min: {
            $map: {
              input: '$genres.description',
              as: 'genre',
              in: {
                $let: {
                  vars: {
                    idx: { $indexOfArray: [sidebarTags, '$$genre'] },
                  },
                  in: {
                    $cond: [
                      { $ne: ['$$idx', -1] },
                      '$$idx', // Use actual index from sidebarTags
                      null, // Ignore non-matches
                    ],
                  },
                },
              },
            },
          },
        },
        // Count of matches for secondary sorting
        matchCount: {
          $size: {
            $setIntersection: [sidebarTags, '$genres.description'],
          },
        },
      },
    },
    {
      $sort: {
        priorityOrder: 1, // Lower values (earlier in sidebarTags) first
        matchCount: -1, // More matches first within same priority
        'release_date.date': -1,
      },
    },
    {
      $project: {
        priorityOrder: 0, // Remove temporary field from results
      },
    },
  ]).exec();
}

/*@ts-expect-error type error */
sortedGameInfo.get('/sortedGameInfo', async (req, res) => {
  if (!req.query.sidebarTags) {
    return res.status(400).json({ // Added return
      success: false,
      message: `Invalid sidebarTags query parameter. Received: ${req.query.sidebarTags}`,
    });
  }

  const sidebarTags = decodeURIComponent(req.query.sidebarTags?.toString() ?? '');

  try {
    const parsedData = JSON.parse(sidebarTags);

    if (!Array.isArray(parsedData)) {
      return res.status(400).json({
        success: false,
        message: `Wrong type of sidebarTags parameter. Received: ${typeof parsedData}`,
      });
    }

    const data = await getSortedGameInfo(parsedData);

    if (data.length > 0) {
      return res.json({ success: true, data });
    }

    return res.status(404).json({
      success: false,
      message: 'No games found matching the selected genres',
      suggestion: 'Try different genre filters',
    });

  } catch (error) {
    console.error('Error fetching sorted game info:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default sortedGameInfo;