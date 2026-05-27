using Xunit;

namespace JobTracker.Tests.Infrastructure;

[CollectionDefinition("Integration")]
public class IntegrationCollectionFixture : ICollectionFixture<JobTrackerFactory>
{
}